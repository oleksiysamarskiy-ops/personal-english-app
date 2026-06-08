export type VocabStatus = 'New' | 'Learning' | 'Known' | 'Weak';
export type VocabCategory = 'Word' | 'Phrase' | 'Slang' | 'Idiom';
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type Genre = 'Comedy' | 'Drama' | 'Action' | 'Sci-Fi' | 'Fantasy' | 'Crime' | 'Thriller';

export interface VocabItem {
  id: string;
  term: string;
  translation: string;
  example: string;
  category: VocabCategory;
  status: VocabStatus;
  dateAdded: string;
  nextReviewDate: string;
  correctStreak: number;
}

export interface QuizQuestion {
  id: string;
  type: 'translation' | 'phrase' | 'context';
  question: string;
  options: string[];
  correctIndex: number;
  vocabTerm?: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: Genre;
  level: Level;
  year: number;
  emoji: string;
  watched: boolean;
  quizCompleted: boolean;
  quizScore?: number;
  watchedAt?: string;
  quiz: QuizQuestion[];
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  description: string;
  watched: boolean;
  quizCompleted: boolean;
  quizScore?: number;
  watchedAt?: string;
  quiz: QuizQuestion[];
}

export interface Season {
  id: string;
  seasonNumber: number;
  episodes: Episode[];
}

export interface Series {
  id: string;
  title: string;
  description: string;
  genre: Genre;
  level: Level;
  year: number;
  emoji: string;
  seasons: Season[];
}

export interface QuizResult {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: 'movie' | 'episode';
  score: number;
  total: number;
  accuracy: number;
  date: string;
  wrongTerms: string[];
}

export type TabId = 'dashboard' | 'dictionary' | 'review' | 'movies' | 'progress';
