import React from 'react';
import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onClick: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, isSelected, onClick }) => {
  return (
    <button
      onClick={() => onClick(character)}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 text-left w-full h-full flex flex-col gap-2
        ${isSelected 
          ? 'border-amber-500 bg-amber-50 shadow-md transform scale-[1.02]' 
          : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{character.icon}</span>
        {isSelected && (
          <div className="bg-amber-500 text-white rounded-full p-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-bold text-slate-800 serif-font">{character.name}</h3>
        <p className="text-xs text-slate-500 line-clamp-2">{character.description}</p>
      </div>
    </button>
  );
};
