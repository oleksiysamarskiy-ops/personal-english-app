export type WordStatus = 'new' | 'mistake' | 'learned';

export interface WordCard {
  id: string;
  english: string;
  translation: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  createdAt: string;
  correctAnswers: number;
  mistakes: number;
  status: WordStatus;
}
