import React from 'react';
import { VocabItem, Movie, Series } from '../types';
import { BookOpen, MessageSquare, AlertTriangle, Clock, Film, Tv, Target, TrendingUp, Globe } from 'lucide-react';

interface DashboardProps {
  vocab: VocabItem[];
  movies: Movie[];
  series: Series[];
  quizResults: any[];
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string; bg: string }> = ({ icon, label, value, color, bg }) => (
  <div className={`rounded-2xl p-4 flex flex-col gap-2 ${bg} border border-white/5`}>
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <div className="text-2xl font-black text-white font-display">{value}</div>
    <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ vocab, movies, series, quizResults }) => {
  const today = new Date().toISOString().split('T')[0];

  const totalWords = vocab.filter(v => v.category === 'Word').length;
  const totalPhrases = vocab.filter(v => v.category === 'Phrase' || v.category === 'Idiom').length;
  const weakWords = vocab.filter(v => v.status === 'Weak').length;
  const dueToday = vocab.filter(v => v.nextReviewDate <= today && v.status !== 'Known').length;
  const moviesWatched = movies.filter(m => m.watched).length;
  const episodesWatched = series.reduce((acc, s) => acc + s.seasons.reduce((a, se) => a + se.episodes.filter(e => e.watched).length, 0), 0);
  const avgAccuracy = quizResults.length > 0 ? Math.round(quizResults.reduce((a, r) => a + r.accuracy, 0) / quizResults.length) : 0;

  const recentVocab = [...vocab].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 5);
  const recentMovies = movies.filter(m => m.watchedAt).sort((a, b) => (b.watchedAt || '').localeCompare(a.watchedAt || '')).slice(0, 3);
  const recentEps = series.flatMap(s => s.seasons.flatMap(se => se.episodes.filter(e => e.watchedAt).map(e => ({ ...e, seriesTitle: s.title, emoji: s.emoji })))).sort((a, b) => (b.watchedAt || '').localeCompare(a.watchedAt || '')).slice(0, 2);

  const knownWords = vocab.filter(v => v.status === 'Known' && v.category === 'Word').length;
  const knownPhrases = vocab.filter(v => v.status === 'Known' && (v.category === 'Phrase' || v.category === 'Idiom')).length;

  const statusColor: Record<string, string> = { New: 'bg-blue-500/20 text-blue-400', Learning: 'bg-amber-500/20 text-amber-400', Known: 'bg-emerald-500/20 text-emerald-400', Weak: 'bg-rose-500/20 text-rose-400' };
  const catColor: Record<string, string> = { Word: 'bg-violet-500/20 text-violet-400', Phrase: 'bg-cyan-500/20 text-cyan-400', Slang: 'bg-orange-500/20 text-orange-400', Idiom: 'bg-pink-500/20 text-pink-400' };

  return (
    <div className="pb-24">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🎬</span>
          <h1 className="text-2xl font-black text-white font-display tracking-tight">English Through Movies</h1>
        </div>
        <p className="text-slate-400 text-sm">Keep learning, keep watching</p>
      </div>

      {/* Universe Section */}
      <div className="mx-5 mb-5 rounded-3xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-950/60 via-indigo-950/60 to-slate-900/60 backdrop-blur">
        <div className="px-5 pt-4 pb-2 flex items-center gap-2 border-b border-white/5">
          <Globe size={16} className="text-violet-400" />
          <span className="text-sm font-bold text-violet-300 uppercase tracking-widest">My English Universe</span>
        </div>
        <div className="grid grid-cols-3 divide-x divide-white/5">
          {[
            { label: 'Words', value: knownWords, icon: '📚' },
            { label: 'Phrases', value: knownPhrases, icon: '💬' },
            { label: 'Weak', value: weakWords, icon: '⚠️' },
            { label: 'Movies', value: moviesWatched, icon: '🎬' },
            { label: 'Episodes', value: episodesWatched, icon: '📺' },
            { label: 'Avg Score', value: `${avgAccuracy}%`, icon: '🎯' },
          ].map((item, i) => (
            <div key={i} className={`px-3 py-3 text-center ${i >= 3 ? 'border-t border-white/5' : ''}`}>
              <div className="text-lg mb-0.5">{item.icon}</div>
              <div className="text-lg font-black text-white font-display">{item.value}</div>
              <div className="text-xs text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<BookOpen size={16} />} label="Total Words" value={totalWords} color="bg-violet-500/20 text-violet-400" bg="bg-slate-900" />
          <StatCard icon={<MessageSquare size={16} />} label="Total Phrases" value={totalPhrases} color="bg-cyan-500/20 text-cyan-400" bg="bg-slate-900" />
          <StatCard icon={<AlertTriangle size={16} />} label="Weak Words" value={weakWords} color="bg-rose-500/20 text-rose-400" bg="bg-slate-900" />
          <StatCard icon={<Clock size={16} />} label="Due Today" value={dueToday} color="bg-amber-500/20 text-amber-400" bg="bg-slate-900" />
          <StatCard icon={<Film size={16} />} label="Movies Watched" value={moviesWatched} color="bg-emerald-500/20 text-emerald-400" bg="bg-slate-900" />
          <StatCard icon={<Tv size={16} />} label="Episodes Watched" value={episodesWatched} color="bg-blue-500/20 text-blue-400" bg="bg-slate-900" />
        </div>
        {quizResults.length > 0 && (
          <div className="mt-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Target size={18} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Quiz Accuracy</div>
                <div className="text-2xl font-black text-white font-display">{avgAccuracy}%</div>
              </div>
            </div>
            <div className="text-slate-600 text-sm">{quizResults.length} quizzes</div>
          </div>
        )}
      </div>

      {/* Weak Words Alert */}
      {weakWords > 0 && (
        <div className="mx-5 mb-5 rounded-2xl bg-rose-950/40 border border-rose-500/30 p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="text-rose-300 font-bold text-sm">{weakWords} weak word{weakWords !== 1 ? 's' : ''} need review</div>
            <div className="text-rose-400/60 text-xs mt-0.5">These will appear more often in flashcard reviews</div>
          </div>
        </div>
      )}

      {/* Recent Vocabulary */}
      {recentVocab.length > 0 && (
        <div className="px-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-slate-400" />
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Recent Vocabulary</h2>
          </div>
          <div className="space-y-2">
            {recentVocab.map(v => (
              <div key={v.id} className="rounded-xl bg-slate-900 border border-white/5 p-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{v.term}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[v.status]}`}>{v.status}</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5 truncate">{v.translation}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ml-2 shrink-0 ${catColor[v.category]}`}>{v.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Watched */}
      {(recentMovies.length > 0 || recentEps.length > 0) && (
        <div className="px-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Film size={16} className="text-slate-400" />
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Recently Watched</h2>
          </div>
          <div className="space-y-2">
            {recentMovies.map(m => (
              <div key={m.id} className="rounded-xl bg-slate-900 border border-white/5 p-3 flex items-center gap-3">
                <span className="text-2xl">{m.emoji}</span>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">{m.title}</div>
                  <div className="text-slate-500 text-xs">Movie · {m.level}</div>
                </div>
                {m.quizCompleted && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg">Quiz ✓</span>}
              </div>
            ))}
            {recentEps.map((e: any) => (
              <div key={e.id} className="rounded-xl bg-slate-900 border border-white/5 p-3 flex items-center gap-3">
                <span className="text-2xl">{e.emoji}</span>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">{e.title}</div>
                  <div className="text-slate-500 text-xs">{e.seriesTitle}</div>
                </div>
                {e.quizCompleted && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg">Quiz ✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
