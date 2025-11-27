export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface Character {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or simple icon representation
}

export interface GeneratedResult {
  imageUrl: string;
  promptUsed: string;
}

export type ClothingStyle = 'modern' | 'ancient';
