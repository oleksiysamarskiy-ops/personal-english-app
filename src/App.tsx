import React, { useState } from 'react';
import { TabId, VocabItem, Movie, Series, QuizResult } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_VOCAB, INITIAL_MOVIES, INITIAL_SERIES } from './data/mockData';
import { Dashboard } from './components/Dashboard';
import { Dictionary } from './components/Dictionary';
import { Review } from './components/Review';
import { Movies } from './components/Movies';
import { Progress } from './components/Progress';

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);
const CardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const FilmIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>
  </svg>
);
const ChartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Home',     icon: <HomeIcon /> },
  { id: 'dictionary', label: 'Words',   icon: <BookIcon /> },
  { id: 'review',     label: 'Review',  icon: <CardIcon /> },
  { id: 'movies',     label: 'Movies',  icon: <FilmIcon /> },
  { id: 'progress',   label: 'Progress',icon: <ChartIcon /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [vocab, setVocab] = useLocalStorage<VocabItem[]>('etm_vocab', INITIAL_VOCAB);
  const [movies, setMovies] = useLocalStorage<Movie[]>('etm_movies', INITIAL_MOVIES);
  const [series, setSeries] = useLocalStorage<Series[]>('etm_series', INITIAL_SERIES);
  const [quizResults, setQuizResults] = useLocalStorage<QuizResult[]>('etm_quiz_results', []);

  const today = new Date().toISOString().split('T')[0];
  const dueCount = vocab.filter(v => v.status !== 'Known' && v.nextReviewDate <= today).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 max-w-lg mx-auto w-full">
        {activeTab === 'dashboard'  && <Dashboard vocab={vocab} movies={movies} series={series} quizResults={quizResults} />}
        {activeTab === 'dictionary' && <Dictionary vocab={vocab} setVocab={setVocab} />}
        {activeTab === 'review'     && <Review vocab={vocab} setVocab={setVocab} />}
        {activeTab === 'movies'     && (
          <Movies
            movies={movies} setMovies={setMovies}
            series={series} setSeries={setSeries}
            quizResults={quizResults} setQuizResults={setQuizResults}
            vocab={vocab} setVocab={setVocab}
          />
        )}
        {activeTab === 'progress'   && <Progress vocab={vocab} movies={movies} series={series} quizResults={quizResults} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-xl border-t border-white/5 z-40">
        <div className="max-w-lg mx-auto flex">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const showBadge = tab.id === 'review' && dueCount > 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1 relative transition-all duration-150 ${
                  isActive ? 'text-violet-400' : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <div className={`relative transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}>
                  {tab.icon}
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center leading-none">
                      {dueCount > 9 ? '9+' : dueCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold tracking-wide transition-all ${isActive ? 'text-violet-400' : 'text-slate-600'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-violet-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        {/* iOS safe area */}
        <div className="h-safe-bottom bg-transparent" style={{ height: 'env(safe-area-inset-bottom)' }} />
      </nav>
    </div>
  );
}
