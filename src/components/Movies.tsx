import React, { useState, useMemo } from 'react';
import { Movie, Series, Season, Episode, QuizResult, VocabItem, Level, Genre } from '../types';
import { Quiz } from './Quiz';
import { ChevronRight, ChevronDown, Play, Check, BookOpen } from 'lucide-react';

interface MoviesProps {
  movies: Movie[];
  setMovies: (value: Movie[] | ((prev: Movie[]) => Movie[])) => void;
  series: Series[];
  setSeries: (value: Series[] | ((prev: Series[]) => Series[])) => void;
  quizResults: QuizResult[];
  setQuizResults: (value: QuizResult[] | ((prev: QuizResult[]) => QuizResult[])) => void;
  vocab: VocabItem[];
  setVocab: (value: VocabItem[] | ((prev: VocabItem[]) => VocabItem[])) => void;
}

const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
const GENRES: Genre[] = ['Comedy', 'Drama', 'Action', 'Sci-Fi', 'Fantasy', 'Crime', 'Thriller'];

const levelStyle: Record<Level, string> = {
  A1: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  A2: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
  B1: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  B2: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  C1: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
};

const genreStyle: Record<string, string> = {
  Comedy: 'bg-yellow-500/10 text-yellow-400',
  Drama: 'bg-purple-500/10 text-purple-400',
  Action: 'bg-red-500/10 text-red-400',
  'Sci-Fi': 'bg-cyan-500/10 text-cyan-400',
  Fantasy: 'bg-indigo-500/10 text-indigo-400',
  Crime: 'bg-orange-500/10 text-orange-400',
  Thriller: 'bg-rose-500/10 text-rose-400',
};

export const Movies: React.FC<MoviesProps> = ({
  movies, setMovies, series, setSeries, quizResults, setQuizResults, vocab, setVocab
}) => {
  const [tab, setTab] = useState<'movies' | 'series'>('movies');
  const [levelFilter, setLevelFilter] = useState<Level | 'All'>('All');
  const [genreFilter, setGenreFilter] = useState<Genre | 'All'>('All');
  const [activeQuiz, setActiveQuiz] = useState<{ id: string; title: string; type: 'movie' | 'episode'; questions: any[] } | null>(null);
  const [expandedSeries, setExpandedSeries] = useState<string | null>(null);
  const [expandedSeason, setExpandedSeason] = useState<string | null>(null);

  const filteredMovies = useMemo(() => movies.filter(m =>
    (levelFilter === 'All' || m.level === levelFilter) &&
    (genreFilter === 'All' || m.genre === genreFilter)
  ), [movies, levelFilter, genreFilter]);

  const filteredSeries = useMemo(() => series.filter(s =>
    (levelFilter === 'All' || s.level === levelFilter) &&
    (genreFilter === 'All' || s.genre === genreFilter)
  ), [series, levelFilter, genreFilter]);

  const markMovieWatched = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setMovies(prev => prev.map(m => m.id === id ? { ...m, watched: true, watchedAt: today } : m));
  };

  const markEpisodeWatched = (seriesId: string, seasonId: string, episodeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setSeries(prev => prev.map(s => s.id !== seriesId ? s : {
      ...s,
      seasons: s.seasons.map(se => se.id !== seasonId ? se : {
        ...se,
        episodes: se.episodes.map(ep => ep.id !== episodeId ? ep : {
          ...ep, watched: true, watchedAt: today
        })
      })
    }));
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResults(prev => [result, ...prev]);
    if (result.contentType === 'movie') {
      setMovies(prev => prev.map(m => m.id === result.contentId ? { ...m, quizCompleted: true, quizScore: result.accuracy } : m));
    } else {
      setSeries(prev => prev.map(s => ({
        ...s,
        seasons: s.seasons.map(se => ({
          ...se,
          episodes: se.episodes.map(ep => ep.id === result.contentId ? { ...ep, quizCompleted: true, quizScore: result.accuracy } : ep)
        }))
      })));
    }
    setActiveQuiz(null);
  };

  const getSeriesProgress = (s: Series) => {
    const allEps = s.seasons.flatMap(se => se.episodes);
    const watched = allEps.filter(e => e.watched).length;
    return { watched, total: allEps.length };
  };

  return (
    <div className="pb-24">
      {/* Tabs */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-black text-white font-display tracking-tight mb-4">Movies & Series</h1>
        <div className="flex bg-slate-900 rounded-xl p-1 gap-1">
          {(['movies', 'series'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize ${tab === t ? 'bg-violet-600 text-white' : 'text-slate-400'}`}>
              {t === 'movies' ? '🎬 Movies' : '📺 Series'}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="overflow-x-auto scrollbar-hide px-5 mb-2">
        <div className="flex gap-2 w-max">
          <button onClick={() => setLevelFilter('All')} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${levelFilter === 'All' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}>All Levels</button>
          {LEVELS.map(l => (
            <button key={l} onClick={() => setLevelFilter(l === levelFilter ? 'All' : l)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${levelFilter === l ? 'bg-violet-600 text-white border-transparent' : `border ${levelStyle[l]} bg-transparent`}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-hide px-5 mb-4">
        <div className="flex gap-2 w-max">
          <button onClick={() => setGenreFilter('All')} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${genreFilter === 'All' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}>All Genres</button>
          {GENRES.map(g => (
            <button key={g} onClick={() => setGenreFilter(g === genreFilter ? 'All' : g)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${genreFilter === g ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{g}</button>
          ))}
        </div>
      </div>

      {/* Movies Tab */}
      {tab === 'movies' && (
        <div className="px-5 space-y-3">
          {filteredMovies.length === 0 && (
            <div className="text-center py-16 text-slate-500"><div className="text-4xl mb-2">🎬</div>No movies match your filters</div>
          )}
          {filteredMovies.map(m => (
            <div key={m.id} className="rounded-2xl bg-slate-900 border border-white/5 overflow-hidden">
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="text-4xl w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">{m.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-black text-white font-display text-base leading-tight">{m.title}</h3>
                      <span className="text-xs text-slate-500 shrink-0">{m.year}</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${levelStyle[m.level]}`}>{m.level}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${genreStyle[m.genre] || 'bg-slate-700 text-slate-300'}`}>{m.genre}</span>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{m.description}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                {!m.watched ? (
                  <button onClick={() => markMovieWatched(m.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95">
                    <Play size={14} fill="currentColor" /> Mark Watched
                  </button>
                ) : !m.quizCompleted ? (
                  <>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold px-3 py-2 bg-emerald-950/40 rounded-xl border border-emerald-500/20">
                      <Check size={12} /> Watched
                    </div>
                    <button onClick={() => setActiveQuiz({ id: m.id, title: m.title, type: 'movie', questions: m.quiz })}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95">
                      <BookOpen size={14} /> Take Quiz
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-between px-3 py-2 bg-emerald-950/30 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                      <Check size={14} /> Quiz Complete
                    </div>
                    {m.quizScore !== undefined && (
                      <span className="text-emerald-300 font-black text-sm">{m.quizScore}%</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Series Tab */}
      {tab === 'series' && (
        <div className="px-5 space-y-3">
          {filteredSeries.length === 0 && (
            <div className="text-center py-16 text-slate-500"><div className="text-4xl mb-2">📺</div>No series match your filters</div>
          )}
          {filteredSeries.map(s => {
            const prog = getSeriesProgress(s);
            const isExpanded = expandedSeries === s.id;
            return (
              <div key={s.id} className="rounded-2xl bg-slate-900 border border-white/5 overflow-hidden">
                <button className="w-full text-left p-4" onClick={() => setExpandedSeries(isExpanded ? null : s.id)}>
                  <div className="flex gap-3">
                    <div className="text-4xl w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">{s.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-black text-white font-display text-base leading-tight">{s.title}</h3>
                        <span className="text-slate-500 shrink-0">{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${levelStyle[s.level]}`}>{s.level}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${genreStyle[s.genre] || 'bg-slate-700 text-slate-300'}`}>{s.genre}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-1">
                          <div className="bg-violet-500 h-1 rounded-full transition-all" style={{ width: prog.total > 0 ? `${(prog.watched / prog.total) * 100}%` : '0%' }} />
                        </div>
                        <span className="text-xs text-slate-500 shrink-0">{prog.watched}/{prog.total} eps</span>
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-white/5">
                    <p className="px-4 py-2 text-slate-500 text-xs leading-relaxed">{s.description}</p>
                    {s.seasons.map(season => {
                      const seasonKey = `${s.id}-${season.id}`;
                      const isSeasonExpanded = expandedSeason === seasonKey;
                      return (
                        <div key={season.id} className="border-t border-white/5">
                          <button className="w-full flex items-center justify-between px-4 py-3 text-left"
                            onClick={() => setExpandedSeason(isSeasonExpanded ? null : seasonKey)}>
                            <span className="text-sm font-bold text-slate-300">Season {season.seasonNumber}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">{season.episodes.filter(e => e.watched).length}/{season.episodes.length}</span>
                              {isSeasonExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                            </div>
                          </button>
                          {isSeasonExpanded && (
                            <div className="pb-2">
                              {season.episodes.map(ep => (
                                <div key={ep.id} className="px-4 py-3 border-t border-white/5">
                                  <div className="flex items-start gap-3">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${ep.watched ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                                      {ep.episodeNumber}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-semibold text-white leading-tight mb-0.5">{ep.title}</div>
                                      <div className="text-xs text-slate-500 leading-relaxed line-clamp-2">{ep.description}</div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 mt-2.5 ml-10">
                                    {!ep.watched ? (
                                      <button onClick={() => markEpisodeWatched(s.id, season.id, ep.id)}
                                        className="flex items-center gap-1 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95">
                                        <Play size={10} fill="currentColor" /> Watched
                                      </button>
                                    ) : !ep.quizCompleted ? (
                                      <>
                                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold px-2 py-1.5 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
                                          <Check size={10} /> Watched
                                        </div>
                                        <button onClick={() => setActiveQuiz({ id: ep.id, title: `${s.title} S${season.seasonNumber}E${ep.episodeNumber}`, type: 'episode', questions: ep.quiz })}
                                          className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95">
                                          <BookOpen size={10} /> Quiz
                                        </button>
                                      </>
                                    ) : (
                                      <div className="flex items-center gap-2 text-xs">
                                        <span className="flex items-center gap-1 text-emerald-400 font-semibold px-2 py-1.5 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
                                          <Check size={10} /> Quiz ✓
                                        </span>
                                        {ep.quizScore !== undefined && <span className="text-emerald-300 font-bold">{ep.quizScore}%</span>}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeQuiz && (
        <Quiz
          contentId={activeQuiz.id}
          contentTitle={activeQuiz.title}
          contentType={activeQuiz.type}
          questions={activeQuiz.questions}
          onClose={() => setActiveQuiz(null)}
          onComplete={handleQuizComplete}
          vocab={vocab}
          setVocab={setVocab}
        />
      )}
    </div>
  );
};
