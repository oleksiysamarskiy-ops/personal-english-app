import { WordCard } from '../types/WordCard';

const STORAGE_KEY = 'wordflow_cards';

export function loadCards(): WordCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WordCard[]) : [];
  } catch {
    return [];
  }
}

export function saveCards(cards: WordCard[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}
