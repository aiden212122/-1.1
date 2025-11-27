import React, { useState, useRef } from 'react';
import { Sparkles, RefreshCw, Download, Camera, Wand2, Shirt, User, History } from 'lucide-react';
import { BIBLICAL_CHARACTERS } from './constants';
import { Character, GenerationStatus, ClothingStyle } from './types';
import { CharacterCard } from './components/CharacterCard';
import { generateCompositeImage } from './services/geminiService';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [customCharacterName, setCustomCharacterName] = useState<string>('');
  const [clothingStyle, setClothingStyle] = useState<ClothingStyle>('modern');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false); // Advanced/Freeform mode
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please upload an image under 5MB. / 文件过大，请上传小于 5MB 的图片。");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCharacterSelect = (char: Character) => {
    setSelectedCharacter(char);
    setCustomCharacterName(''); // Clear custom input when selecting a preset
  };

  const handleCustomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCharacterName(e.target.value);
    if (e.target.value) {
      setSelectedCharacter(null); // Clear preset when typing custom
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    
    // Validation
    if (isCustomMode) {
      if (!customPrompt.trim()) {
        setError("Please enter a description for your custom edit. / 请输入自定义编辑的描述。");
        return;
      }
    } else {
      if (!selectedCharacter && !customCharacterName.trim()) {
        setError("Please select a character or enter a name. / 请选择一个人物或输入名字。");
        return;
      }
    }

    setStatus(GenerationStatus.LOADING);
    setError(null);

    try {
      let promptText = "";
      
      if (isCustomMode) {
        promptText = customPrompt;
      } else {
        // Strip the Chinese part if picking from presets to avoid confusion, though Gemini handles mixed well.
        // Or just use the full string, Gemini is smart. Let's use the full string but ensure context is clear.
        const charName = selectedCharacter ? selectedCharacter.name : customCharacterName;
        
        const clothingInstruction = clothingStyle === 'ancient' 
          ? "The person from the uploaded photo must be wearing authentic Ancient Israelite/Biblical era clothing (tunics, robes) to match the time period." 
          : "The person from the uploaded photo must keep their modern clothing.";

        promptText = `
          Generate a realistic image of the person from the uploaded photo standing next to the biblical figure: ${charName}.
          
          1. **Scene & Setting**: The background must be a historically accurate representation of ${charName}'s biblical era and location (e.g., ancient Jerusalem, desert, Galilee, palace, etc.).
          2. **Character Appearance**: ${charName} must be depicted with strict historical accuracy appropriate to their time and role in the Bible.
          3. **User Appearance**: Identify the person in the provided image. ${clothingInstruction}
          4. **Composition**: Blend the user and ${charName} naturally into the scene with realistic lighting, shadows, and interaction.
        `;
      }

      const generatedImageBase64 = await generateCompositeImage(selectedImage, promptText);
      setResultImage(generatedImageBase64);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again. / 出错了，请重试。");
      setStatus(GenerationStatus.ERROR);
    }
  };

  const handleReset = () => {
    // Keep the image, reset settings
    setResultImage(null);
    setStatus(GenerationStatus.IDLE);
    setError(null);
  };

  const handleFullReset = () => {
    setSelectedImage(null);
    setSelectedCharacter(null);
    setCustomCharacterName('');
    setResultImage(null);
    setStatus(GenerationStatus.IDLE);
    setCustomPrompt('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
             <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-amber-400" />
             </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 serif-font">
            DivineSnap <span className="block text-xl md:text-2xl mt-2 font-normal text-slate-300">Biblical AI Photo Editor / 圣经人物合照生成器</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Upload your photo and virtually travel back in time to pose with legendary biblical figures.
            <br/>
            上传您的照片，穿越时空与圣经传奇人物合影。
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 -mt-8">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          
          <div className="p-6 md:p-8">
            
            {/* Step 1: Upload */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">1</span>
                Upload Your Photo / 上传您的照片
              </h2>
              
              {!selectedImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform group-hover:bg-amber-100 group-hover:text-amber-500">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">Click to upload a selfie / 点击上传自拍</h3>
                  <p className="text-sm text-slate-500">JPG or PNG, max 5MB / 支持 JPG 或 PNG，最大 5MB</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                   <div className="aspect-video w-full flex items-center justify-center bg-slate-900">
                      <img src={selectedImage} alt="Uploaded" className="max-h-[400px] w-auto mx-auto object-contain" />
                   </div>
                   <button 
                    onClick={handleFullReset}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-lg transition-colors"
                    title="Change photo / 更换照片"
                   >
                     <RefreshCw className="w-5 h-5" />
                   </button>
                </div>
              )}
            </div>

            {/* Config Area - Only show if image uploaded and no result yet */}
            {selectedImage && !resultImage && (
              <div className="animate-fade-in space-y-10">
                
                {/* Mode Switcher */}
                <div className="flex justify-end">
                   <button 
                    onClick={() => setIsCustomMode(!isCustomMode)}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                  >
                    {isCustomMode ? 'Back to Character Selector / 返回人物选择' : 'Switch to Freeform Prompt / 切换到自由描述模式'}
                    <Wand2 className="w-4 h-4" />
                  </button>
                </div>

                {isCustomMode ? (
                   <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">2</span>
                      Describe Your Vision / 描述您的构想
                    </h2>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        What would you like to add or change? / 您想添加或改变什么？
                      </label>
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="e.g., Add a halo above my head... / 例如：在我的头顶加一个光环..."
                        className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[120px]"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Step 2: Character Selection */}
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">2</span>
                        Choose a Biblical Figure / 选择圣经人物
                      </h2>
                      
                      {/* Manual Input */}
                      <div className="mb-6">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            value={customCharacterName}
                            onChange={handleCustomNameChange}
                            placeholder="Type a name (e.g., Solomon / 所罗门)..."
                            className={`
                              block w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-0 transition-colors
                              ${customCharacterName 
                                ? 'border-amber-500 bg-amber-50' 
                                : 'border-slate-200 bg-white focus:border-amber-400'
                              }
                            `}
                          />
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          Or select from the popular figures below / 或从下方选择热门人物:
                        </p>
                      </div>

                      {/* Preset Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {BIBLICAL_CHARACTERS.map((char) => (
                          <CharacterCard
                            key={char.id}
                            character={char}
                            isSelected={selectedCharacter?.id === char.id && !customCharacterName}
                            onClick={handleCharacterSelect}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Step 3: Clothing Selection */}
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">3</span>
                        Choose Your Attire / 选择服装风格
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setClothingStyle('modern')}
                          className={`
                            p-4 rounded-xl border-2 transition-all flex items-center gap-4
                            ${clothingStyle === 'modern'
                              ? 'border-amber-500 bg-amber-50 shadow-md'
                              : 'border-slate-200 bg-white hover:border-amber-300'
                            }
                          `}
                        >
                          <div className={`p-3 rounded-full ${clothingStyle === 'modern' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <Shirt className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-slate-800">Modern / 现代服装</h3>
                            <p className="text-sm text-slate-500">Keep original outfit<br/>保持原有着装</p>
                          </div>
                        </button>

                        <button
                          onClick={() => setClothingStyle('ancient')}
                          className={`
                            p-4 rounded-xl border-2 transition-all flex items-center gap-4
                            ${clothingStyle === 'ancient'
                              ? 'border-amber-500 bg-amber-50 shadow-md'
                              : 'border-slate-200 bg-white hover:border-amber-300'
                            }
                          `}
                        >
                          <div className={`p-3 rounded-full ${clothingStyle === 'ancient' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <History className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-slate-800">Biblical / 圣经服饰</h3>
                            <p className="text-sm text-slate-500">Ancient robes & tunics<br/>古代长袍</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="my-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Action Area */}
            {selectedImage && !resultImage && (
              <div className="flex justify-end pt-8 mt-8 border-t border-slate-100">
                <button
                  onClick={handleGenerate}
                  disabled={status === GenerationStatus.LOADING || (!isCustomMode && !selectedCharacter && !customCharacterName)}
                  className={`
                    w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all
                    ${status === GenerationStatus.LOADING || (!isCustomMode && !selectedCharacter && !customCharacterName && !customPrompt)
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  {status === GenerationStatus.LOADING ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Scene... / 正在生成...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate / 生成合照
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Result View */}
            {resultImage && (
               <div className="animate-fade-in space-y-8">
                 <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 serif-font mb-2">A Divine Encounter / 神圣的相遇</h2>
                    <p className="text-slate-500">Your masterpiece is ready. / 您的作品已准备就绪。</p>
                 </div>
                 
                 <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
                    <img src={resultImage} alt="Generated result" className="w-full h-auto" />
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href={resultImage} 
                      download="divine-snap.png"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      Download / 下载图片
                    </a>
                    <button 
                      onClick={handleReset}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium shadow-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Another / 试另一个人物
                    </button>
                 </div>
               </div>
            )}
            
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Powered by Gemini 2.5 Flash Image</p>
        </div>
      </main>
    </div>
  );
};

export default App;