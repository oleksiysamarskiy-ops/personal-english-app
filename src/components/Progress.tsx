import React from 'react';
import { VocabItem, Movie, Series, QuizResult, VocabCategory } from '../types';
import { Globe, TrendingUp, BookOpen, Film, Tv, Target, AlertTriangle, Award } from 'lucide-react';

interface ProgressProps {
  vocab: VocabItem[];
  movies: Movie[];
  series: Series[];
  quizResults: QuizResult[];
}

const catColor: Record<VocabCategory, { bar: string; bg: string; text: string }> = {
  Word: { bar: 'bg-violet-500', bg: 'bg-violet-500/10', text: 'text-violet-400' },
  Phrase: { bar: 'bg-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  Slang: { bar: 'bg-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  Idiom: { bar: 'bg-pink-500', bg: 'bg-pink-500/10', text: 'text-pink-400' },
};

export const Progress: React.FC<ProgressProps> = ({ vocab, movies, series, quizResults }) => {
  const known = vocab.filter(v => v.status === 'Known');
  const weak = vocab.filter(v => v.status === 'Weak');
  const learning = vocab.filter(v => v.status === 'Learning');
  const knownWords = known.filter(v => v.category === 'Word').length;
  const knownPhrases = known.filter(v => v.category === 'Phrase' || v.category === 'Idiom').length;

  const moviesCompleted = movies.filter(m => m.quizCompleted).length;
  const moviesWatched = movies.filter(m => m.watched).length;
  const totalEpisodes = series.reduce((a, s) => a + s.seasons.reduce((b, se) => b + se.episodes.length, 0), 0);
  const watchedEps = series.reduce((a, s) => a + s.seasons.reduce((b, se) => b + se.episodes.filter(e => e.watched).length, 0), 0);
  const completedEps = series.reduce((a, s) => a + s.seasons.reduce((b, se) => b + se.episodes.filter(e => e.quizCompleted).length, 0), 0);

  const avgAccuracy = quizResults.length > 0
    ? Math.round(quizResults.reduce((a, r) => a + r.accuracy, 0) / quizResults.length)
    : 0;

  const weakWordsList = weak.slice(0, 8);

  const catStats: { cat: VocabCategory; total: number; known: number; learning: number }[] = (['Word', 'Phrase', 'Slang', 'Idiom'] as VocabCategory[]).map(cat => ({
    cat,
    total: vocab.filter(v => v.category === cat).length,
    known: vocab.filter(v => v.category === cat && v.status === 'Known').length,
    learning: vocab.filter(v => v.category === cat && (v.status === 'Learning' || v.status === 'New')).length,
  }));

  const recentResults = quizResults.slice(0, 5);

  return (
    <div className="pb-24">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-black text-white font-display tracking-tight">Progress</h1>
        <p className="text-slate-400 text-sm mt-0.5">Your English learning journey</p>
      </div>

      {/* Universe */}
      <div className="mx-5 mb-5 rounded-3xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-950/60 via-indigo-950/60 to-slate-900/60">
        <div className="px-5 pt-4 pb-3 flex items-center gap-2 border-b border-white/5">
          <Globe size={16} className="text-violet-400" />
          <span className="text-sm font-bold text-violet-300 uppercase tracking-widest">My English Universe</span>
        </div>
        <div className="grid grid-cols-2 divide-x divide-white/5">
          {[
            { label: 'Known Words', value: knownWords, icon: '📚', color: 'text-violet-300' },
            { label: 'Known Phrases', value: knownPhrases, icon: '💬', color: 'text-cyan-300' },
            { label: 'Weak Words', value: weak.length, icon: '⚠️', color: 'text-rose-300' },
            { label: 'Avg Quiz Score', value: `${avgAccuracy}%`, icon: '🎯', color: 'text-amber-300' },
            { label: 'Movies Watched', value: moviesWatched, icon: '🎬', color: 'text-emerald-300' },
            { label: 'Episodes Watched', value: watchedEps, icon: '📺', color: 'text-blue-300' },
          ].map((item, i) => (
            <div key={i} className={`px-4 py-3 ${i >= 2 ? 'border-t border-white/5' : ''} ${i === 1 || i === 3 || i === 5 ? '' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className={`text-xl font-black font-display ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-slate-500">{item.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Stats */}
      <div className="px-5 mb-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <TrendingUp size={14} /> Overview
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <BookOpen size={16} />, label: 'Known Words', value: knownWords, sub: `of ${vocab.filter(v => v.category === 'Word').length} total`, color: 'text-violet-400', iconBg: 'bg-violet-500/15' },
            { icon: <BookOpen size={16} />, label: 'Known Phrases', value: knownPhrases, sub: `of ${vocab.filter(v => v.category === 'Phrase' || v.category === 'Idiom').length} total`, color: 'text-cyan-400', iconBg: 'bg-cyan-500/15' },
            { icon: <AlertTriangle size={16} />, label: 'Weak Words', value: weak.length, sub: 'need more practice', color: 'text-rose-400', iconBg: 'bg-rose-500/15' },
            { icon: <Target size={16} />, label: 'Quiz Accuracy', value: `${avgAccuracy}%`, sub: `${quizResults.length} quizzes taken`, color: 'text-amber-400', iconBg: 'bg-amber-500/15' },
            { icon: <Film size={16} />, label: 'Movies Done', value: `${moviesCompleted}/${movies.length}`, sub: `${moviesWatched} watched`, color: 'text-emerald-400', iconBg: 'bg-emerald-500/15' },
            { icon: <Tv size={16} />, label: 'Episodes Done', value: `${completedEps}/${totalEpisodes}`, sub: `${watchedEps} watched`, color: 'text-blue-400', iconBg: 'bg-blue-500/15' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl bg-slate-900 border border-white/5 p-4">
              <div className={`w-8 h-8 rounded-xl ${s.iconBg} ${s.color} flex items-center justify-center mb-2`}>{s.icon}</div>
              <div className={`text-2xl font-black font-display ${s.color}`}>{s.value}</div>
              <div className="text-xs font-semibold text-white mt-0.5">{s.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Vocabulary */}
      <div className="px-5 mb-5">
        <div className="rounded-2xl bg-slate-900 border border-white/5 p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-white">Total Vocabulary</h2>
            <span className="text-2xl font-black text-violet-400 font-display">{vocab.length}</span>
          </div>
          <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-2">
            {known.length > 0 && <div className="bg-emerald-500 transition-all" style={{ width: `${(known.length / vocab.length) * 100}%` }} />}
            {learning.length > 0 && <div className="bg-amber-500 transition-all" style={{ width: `${(learning.length / vocab.length) * 100}%` }} />}
            {weak.length > 0 && <div className="bg-rose-500 transition-all" style={{ width: `${(weak.length / vocab.length) * 100}%` }} />}
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-slate-400">Known: <span className="text-white font-semibold">{known.length}</span></span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-slate-400">Learning: <span className="text-white font-semibold">{learning.length}</span></span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-slate-400">Weak: <span className="text-white font-semibold">{weak.length}</span></span></div>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="px-5 mb-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <BookOpen size={14} /> By Category
        </h2>
        <div className="space-y-2">
          {catStats.map(({ cat, total, known: k }) => (
            <div key={cat} className="rounded-2xl bg-slate-900 border border-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${catColor[cat].bg} ${catColor[cat].text}`}>{cat}</span>
                </div>
                <div className="text-xs text-slate-400">
                  <span className="text-white font-bold">{k}</span> / {total} known
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className={`${catColor[cat].bar} h-1.5 rounded-full transition-all`} style={{ width: total > 0 ? `${(k / total) * 100}%` : '0%' }} />
              </div>
              {total === 0 && <div className="text-xs text-slate-600 mt-1">No {cat.toLowerCase()}s added yet</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Weak Words */}
      {weak.length > 0 && (
        <div className="px-5 mb-5">
          <h2 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <AlertTriangle size={14} /> Weak Words ({weak.length})
          </h2>
          <div className="space-y-2">
            {weakWordsList.map(w => (
              <div key={w.id} className="rounded-xl bg-rose-950/20 border border-rose-500/20 p-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">{w.term}</div>
                  <div className="text-rose-300/60 text-xs mt-0.5">{w.translation}</div>
                </div>
                <div className="text-xs bg-rose-500/15 text-rose-400 px-2 py-1 rounded-lg font-medium">{w.category}</div>
              </div>
            ))}
            {weak.length > 8 && (
              <div className="text-center text-slate-500 text-xs py-2">+{weak.length - 8} more in Dictionary</div>
            )}
          </div>
        </div>
      )}

      {/* Recent Quiz Results */}
      {recentResults.length > 0 && (
        <div className="px-5 mb-5">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Award size={14} /> Recent Quizzes
          </h2>
          <div className="space-y-2">
            {recentResults.map(r => (
              <div key={r.id} className="rounded-xl bg-slate-900 border border-white/5 p-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">{r.contentTitle}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{r.score}/{r.total} correct · {r.date}</div>
                </div>
                <div className={`text-sm font-black font-display ${r.accuracy >= 80 ? 'text-emerald-400' : r.accuracy >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{r.accuracy}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
