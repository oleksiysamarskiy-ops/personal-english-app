import React, { useState, useMemo, useCallback } from 'react';
import { VocabItem } from '../types';
import { RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface ReviewProps {
  vocab: VocabItem[];
  setVocab: (value: VocabItem[] | ((prev: VocabItem[]) => VocabItem[])) => void;
}

export const Review: React.FC<ReviewProps> = ({ vocab, setVocab }) => {
  const today = new Date().toISOString().split('T')[0];
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [sessionStats, setSessionStats] = useState({ again: 0, hard: 0, good: 0 });
  const [currentIdx, setCurrentIdx] = useState(0);

  const dueCards = useMemo(() => {
    const due = vocab.filter(v => v.status !== 'Known' && v.nextReviewDate <= today);
    const weak = vocab.filter(v => v.status === 'Weak' && v.nextReviewDate > today);
    // Weak words appear more often — add extra copies
    const extraWeak = weak.flatMap(w => [w, w]);
    const combined = [...due, ...extraWeak];
    return combined.sort(() => Math.random() - 0.5);
  }, []); // eslint-disable-line

  const upcomingCount = vocab.filter(v => v.status !== 'Known' && v.nextReviewDate > today).length;
  const card = dueCards[currentIdx];

  const addDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const handleAction = useCallback((action: 'again' | 'hard' | 'good') => {
    if (!card) return;
    setSessionStats(prev => ({ ...prev, [action]: prev[action] + 1 }));

    setVocab(prev => prev.map(v => {
      if (v.id !== card.id) return v;
      let nextDate = today;
      let newStatus = v.status;
      let newStreak = v.correctStreak;

      if (action === 'good') {
        nextDate = addDays(7);
        newStreak = v.correctStreak + 1;
        if (v.status === 'Weak' && newStreak >= 3) newStatus = 'Known';
        else if (v.status !== 'Weak') newStatus = 'Known';
      } else if (action === 'hard') {
        nextDate = addDays(3);
        newStreak = 0;
        newStatus = 'Learning';
      } else {
        nextDate = addDays(1);
        newStreak = 0;
        if (v.status !== 'Weak') newStatus = 'Learning';
      }
      return { ...v, nextReviewDate: nextDate, status: newStatus, correctStreak: newStreak };
    }));

    setFlipped(false);
    if (currentIdx >= dueCards.length - 1) {
      setSessionDone(true);
    } else {
      setCurrentIdx(i => i + 1);
    }
  }, [card, currentIdx, dueCards.length, setVocab, today]);

  const catStyle: Record<string, string> = {
    Word: 'text-violet-400 bg-violet-500/10',
    Phrase: 'text-cyan-400 bg-cyan-500/10',
    Slang: 'text-orange-400 bg-orange-500/10',
    Idiom: 'text-pink-400 bg-pink-500/10',
  };

  if (dueCards.length === 0) {
    return (
      <div className="pb-24 px-5 pt-6">
        <h1 className="text-2xl font-black text-white font-display mb-2">Review</h1>
        <div className="mt-16 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-white mb-2">All caught up!</h2>
          <p className="text-slate-400 text-sm">No cards due today.</p>
          {upcomingCount > 0 && <p className="text-slate-500 text-sm mt-2">{upcomingCount} cards coming up soon.</p>}
        </div>
      </div>
    );
  }

  if (sessionDone) {
    const total = sessionStats.again + sessionStats.hard + sessionStats.good;
    const accuracy = total > 0 ? Math.round((sessionStats.good / total) * 100) : 0;
    return (
      <div className="pb-24 px-5 pt-6">
        <h1 className="text-2xl font-black text-white font-display mb-6">Session Complete!</h1>
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">{accuracy >= 80 ? '🏆' : accuracy >= 50 ? '💪' : '📚'}</div>
          <div className="text-4xl font-black text-white font-display">{accuracy}%</div>
          <div className="text-slate-400 text-sm mt-1">accuracy</div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Again', value: sessionStats.again, color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-500/20' },
            { label: 'Hard', value: sessionStats.hard, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-500/20' },
            { label: 'Good', value: sessionStats.good, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/20' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.bg}`}>
              <div className={`text-2xl font-black font-display ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <button onClick={() => { setSessionDone(false); setCurrentIdx(0); setFlipped(false); setSessionStats({ again: 0, hard: 0, good: 0 }); }}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95">
          <RotateCcw size={16} /> Review Again
        </button>
      </div>
    );
  }

  const progress = (currentIdx / dueCards.length) * 100;

  return (
    <div className="pb-24 px-5 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-black text-white font-display">Review</h1>
        <span className="text-slate-400 text-sm">{currentIdx + 1} / {dueCards.length}</span>
      </div>

      <div className="mb-4">
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1.5">
          <div className="bg-violet-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-4 text-xs text-slate-500">
          <span>📅 {dueCards.length} due today</span>
          {upcomingCount > 0 && <span>🔜 {upcomingCount} upcoming</span>}
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-4">
        <div
          onClick={() => !flipped && setFlipped(true)}
          className={`relative rounded-3xl border min-h-[280px] flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-300 ${
            flipped
              ? 'bg-gradient-to-br from-violet-950/40 to-indigo-950/40 border-violet-500/30'
              : 'bg-slate-900 border-white/5 hover:border-violet-500/20'
          }`}
        >
          {card.status === 'Weak' && (
            <div className="absolute top-4 right-4 text-xs bg-rose-950/60 text-rose-400 border border-rose-500/30 px-2 py-1 rounded-lg">⚠️ Weak</div>
          )}
          <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-6 ${catStyle[card.category] || 'text-slate-400 bg-slate-800'}`}>{card.category}</span>

          {!flipped ? (
            <>
              <h2 className="text-3xl font-black text-white font-display text-center mb-3">{card.term}</h2>
              <div className="flex items-center gap-1 text-slate-500 text-sm mt-4">
                <ChevronDown size={14} />
                <span>Tap to reveal</span>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-violet-300 font-display text-center mb-3">{card.term}</h3>
              <div className="text-center">
                <p className="text-white text-base font-medium mb-3">{card.translation}</p>
                {card.example && <p className="text-slate-400 text-sm italic border-l-2 border-violet-500/30 pl-3 text-left">"{card.example}"</p>}
              </div>
            </>
          )}
        </div>
      </div>

      {flipped ? (
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => handleAction('again')} className="flex flex-col items-center gap-1.5 py-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-950/60 active:scale-95 transition-all">
            <RotateCcw size={20} />
            <span className="text-xs font-bold">Again</span>
            <span className="text-xs text-rose-500/70">+1 day</span>
          </button>
          <button onClick={() => handleAction('hard')} className="flex flex-col items-center gap-1.5 py-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-400 hover:bg-amber-950/60 active:scale-95 transition-all">
            <ChevronDown size={20} />
            <span className="text-xs font-bold">Hard</span>
            <span className="text-xs text-amber-500/70">+3 days</span>
          </button>
          <button onClick={() => handleAction('good')} className="flex flex-col items-center gap-1.5 py-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/60 active:scale-95 transition-all">
            <ChevronUp size={20} />
            <span className="text-xs font-bold">Good</span>
            <span className="text-xs text-emerald-500/70">+7 days</span>
          </button>
        </div>
      ) : (
        <div className="text-center text-slate-500 text-sm py-3">Tap the card to see the answer</div>
      )}
    </div>
  );
};
