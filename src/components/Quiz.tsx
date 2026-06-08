import React, { useState } from 'react';
import { QuizQuestion, QuizResult, VocabItem } from '../types';
import { X, Check, RotateCcw, ChevronRight } from 'lucide-react';

interface QuizProps {
  contentId: string;
  contentTitle: string;
  contentType: 'movie' | 'episode';
  questions: QuizQuestion[];
  onClose: () => void;
  onComplete: (result: QuizResult) => void;
  vocab: VocabItem[];
  setVocab: (value: VocabItem[] | ((prev: VocabItem[]) => VocabItem[])) => void;
}

export const Quiz: React.FC<QuizProps> = ({
  contentId, contentTitle, contentType, questions, onClose, onComplete, vocab, setVocab
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ correct: boolean; vocabTerm?: string }[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[currentIdx];

  const markWeakWord = (term?: string) => {
    if (!term) return;
    const today = new Date().toISOString().split('T')[0];
    const exists = vocab.find(v => v.term.toLowerCase() === term.toLowerCase());
    if (exists) {
      setVocab(prev => prev.map(v =>
        v.term.toLowerCase() === term.toLowerCase()
          ? { ...v, status: 'Weak', correctStreak: 0, nextReviewDate: today }
          : v
      ));
    } else {
      const newItem: VocabItem = {
        id: `v${Date.now()}`,
        term,
        translation: '(from quiz — add translation)',
        example: '',
        category: 'Word',
        status: 'Weak',
        dateAdded: today,
        nextReviewDate: today,
        correctStreak: 0,
      };
      setVocab(prev => [newItem, ...prev]);
    }
  };

  const choose = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === q.correctIndex;
    const entry = { correct: isCorrect, vocabTerm: q.vocabTerm };
    setAnswers(prev => [...prev, entry]);
    if (!isCorrect) markWeakWord(q.vocabTerm);
  };

  const next = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
    } else {
      setDone(true);
      const correctCount = [...answers, { correct: selected === q.correctIndex }].filter(a => a.correct).length;
      const total = questions.length;
      const accuracy = Math.round((correctCount / total) * 100);
      const wrongTerms = answers.filter(a => !a.correct && a.vocabTerm).map(a => a.vocabTerm!);
      const result: QuizResult = {
        id: `qr${Date.now()}`,
        contentId,
        contentTitle,
        contentType,
        score: correctCount,
        total,
        accuracy,
        date: new Date().toISOString().split('T')[0],
        wrongTerms,
      };
      onComplete(result);
    }
  };

  const totalCorrect = answers.filter(a => a.correct).length + (done && selected === q?.correctIndex ? 1 : 0);
  const accuracy = done ? Math.round((totalCorrect / questions.length) * 100) : 0;

  const typeLabel: Record<string, string> = {
    translation: '📖 Translation',
    phrase: '💬 Phrase Meaning',
    context: '🎬 Context',
  };

  if (done) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
        <div className="w-full max-w-lg bg-slate-950 border border-white/10 rounded-t-3xl p-6 pb-10">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{accuracy >= 80 ? '🏆' : accuracy >= 60 ? '✅' : '📚'}</div>
            <h2 className="text-2xl font-black text-white font-display">Quiz Complete!</h2>
            <p className="text-slate-400 text-sm mt-1">{contentTitle}</p>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { label: 'Score', value: `${totalCorrect}/${questions.length}`, color: 'text-violet-400' },
              { label: 'Correct', value: totalCorrect, color: 'text-emerald-400' },
              { label: 'Wrong', value: questions.length - totalCorrect, color: 'text-rose-400' },
              { label: 'Accuracy', value: `${accuracy}%`, color: 'text-amber-400' },
            ].map(s => (
              <div key={s.label} className="bg-slate-900 rounded-2xl p-3 text-center border border-white/5">
                <div className={`text-lg font-black font-display ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          {questions.length - totalCorrect > 0 && (
            <div className="mb-4 bg-rose-950/30 border border-rose-500/20 rounded-2xl p-4">
              <div className="text-xs text-rose-400 font-semibold uppercase tracking-wider mb-2">⚠️ Added to Weak Words</div>
              <div className="flex flex-wrap gap-1.5">
                {answers.filter(a => !a.correct && a.vocabTerm).map((a, i) => (
                  <span key={i} className="text-xs bg-rose-950/60 text-rose-300 px-2 py-1 rounded-lg border border-rose-500/20">{a.vocabTerm}</span>
                ))}
              </div>
            </div>
          )}
          <button onClick={onClose} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col">
      <div className="flex-1 overflow-y-auto flex flex-col max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-5 pt-10">
          <div>
            <h2 className="text-lg font-black text-white font-display">{contentTitle}</h2>
            <p className="text-slate-500 text-xs mt-0.5">{currentIdx + 1} of {questions.length}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <X size={16} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 mb-6">
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div className="bg-violet-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${((currentIdx) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="px-5 flex-1">
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 mb-5">
            <span className="text-xs text-slate-500 font-medium">{typeLabel[q.type]}</span>
            <p className="text-white text-lg font-bold mt-2 leading-snug">{q.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let style = 'bg-slate-900 border-white/5 text-white';
              if (selected !== null) {
                if (i === q.correctIndex) style = 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300';
                else if (i === selected) style = 'bg-rose-950/60 border-rose-500/50 text-rose-300';
                else style = 'bg-slate-900 border-white/5 text-slate-500';
              }
              return (
                <button key={i} onClick={() => choose(i)}
                  className={`w-full text-left border rounded-2xl p-4 text-sm font-medium transition-all ${style} ${selected === null ? 'hover:border-violet-500/30 active:scale-[0.98]' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      selected !== null && i === q.correctIndex ? 'bg-emerald-500 text-white' :
                      selected !== null && i === selected && i !== q.correctIndex ? 'bg-rose-500 text-white' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {selected !== null && i === q.correctIndex ? <Check size={12} /> :
                       selected !== null && i === selected && i !== q.correctIndex ? <X size={12} /> :
                       String.fromCharCode(65 + i)}
                    </div>
                    {opt}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Next Button */}
        {selected !== null && (
          <div className="p-5 pb-10">
            <button onClick={next} className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95">
              {currentIdx < questions.length - 1 ? (
                <><span>Next Question</span><ChevronRight size={16} /></>
              ) : (
                <><span>See Results</span><RotateCcw size={16} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
