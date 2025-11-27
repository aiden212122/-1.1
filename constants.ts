import { Character } from './types';

export const BIBLICAL_CHARACTERS: Character[] = [
  { id: 'jesus', name: 'Jesus / 耶稣', description: 'The central figure of Christianity / 基督教的核心人物', icon: '🕊️' },
  { id: 'moses', name: 'Moses / 摩西', description: 'Prophet who split the Red Sea / 分开红海的先知', icon: '🌊' },
  { id: 'david', name: 'David / 大卫', description: 'Shepherd king who defeated Goliath / 击败歌利亚的牧羊王', icon: '👑' },
  { id: 'mary', name: 'Virgin Mary / 圣母玛利亚', description: 'Mother of Jesus / 耶稣的母亲', icon: '🙏' },
  { id: 'noah', name: 'Noah / 诺亚', description: 'Builder of the Ark / 方舟的建造者', icon: '⛵' },
  { id: 'daniel', name: 'Daniel / 但以理', description: 'Survived the lions\' den / 幸存于狮子坑的先知', icon: '🦁' },
  { id: 'paul', name: 'Paul / 保罗', description: 'Early Christian missionary / 早期基督教传教士', icon: '📜' },
  { id: 'esther', name: 'Queen Esther / 以斯帖王后', description: 'Saved the Jewish people / 拯救犹太人的王后', icon: '👸' },
];

export const MODEL_NAME = 'gemini-2.5-flash-image';