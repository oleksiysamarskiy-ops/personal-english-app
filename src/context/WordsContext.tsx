import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WordCard, WordStatus } from '../types/WordCard';
import { loadCards, saveCards } from '../utils/storage';

interface WordsContextValue {
  cards: WordCard[];
  addCard: (card: Omit<WordCard, 'id' | 'createdAt' | 'correctAnswers' | 'mistakes' | 'status'>) => void;
  deleteCard: (id: string) => void;
  markCorrect: (id: string) => void;
  markMistake: (id: string) => void;
}

const WordsContext = createContext<WordsContextValue | null>(null);

export function WordsProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<WordCard[]>(() => loadCards());

  useEffect(() => {
    saveCards(cards);
  }, [cards]);

  const addCard = useCallback(
    (data: Omit<WordCard, 'id' | 'createdAt' | 'correctAnswers' | 'mistakes' | 'status'>) => {
      const newCard: WordCard = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        correctAnswers: 0,
        mistakes: 0,
        status: 'new',
      };
      setCards((prev) => [newCard, ...prev]);
    },
    []
  );

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const markCorrect = useCallback((id: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newMistakes = Math.max(0, c.mistakes - 1);
        const newStatus: WordStatus = newMistakes === 0 ? 'learned' : c.status;
        return {
          ...c,
          correctAnswers: c.correctAnswers + 1,
          mistakes: newMistakes,
          status: newStatus,
        };
      })
    );
  }, []);

  const markMistake = useCallback((id: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return { ...c, mistakes: c.mistakes + 1, status: 'mistake' as WordStatus };
      })
    );
  }, []);

  return (
    <WordsContext.Provider value={{ cards, addCard, deleteCard, markCorrect, markMistake }}>
      {children}
    </WordsContext.Provider>
  );
}

export function useWords(): WordsContextValue {
  const ctx = useContext(WordsContext);
  if (!ctx) throw new Error('useWords must be used inside WordsProvider');
  return ctx;
}
