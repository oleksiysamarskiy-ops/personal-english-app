import { useState, useCallback, useEffect } from 'react';
import { WordCard } from '../types/WordCard';
import { buildQueue } from '../utils/queue';

export function useRepetitionQueue(cards: WordCard[]) {
  const [queue, setQueue] = useState<WordCard[]>(() => buildQueue(cards));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (cards.length === 0) {
      setQueue([]);
      setIndex(0);
      return;
    }
    setQueue(buildQueue(cards));
    setIndex(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  const current = queue.length > 0 ? queue[index % Math.max(queue.length, 1)] : null;

  const advance = useCallback(() => {
    setQueue((q) => {
      const next = index + 1;
      if (next >= q.length) {
        setIndex(0);
        return buildQueue(cards);
      }
      setIndex(next);
      return q;
    });
  }, [index, cards]);

  return { current, advance, total: queue.length };
}
