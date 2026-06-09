import { useState } from 'react';
import { WordsProvider } from './context/WordsContext';
import { DictionaryPage } from './pages/DictionaryPage';
import { RepetitionPage } from './pages/RepetitionPage';
import styles from './App.module.css';

type Tab = 'dictionary' | 'repetition';

export default function App() {
  const [tab, setTab] = useState<Tab>('dictionary');

  return (
    <WordsProvider>
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>W</span>
            <span className={styles.logoText}>WordFlow</span>
          </div>
        </header>

        <nav className={styles.nav}>
          <button
            className={`${styles.tab} ${tab === 'dictionary' ? styles.active : ''}`}
            onClick={() => setTab('dictionary')}
          >
            <span className={styles.tabIcon}>📖</span>
            Словарь
          </button>
          <button
            className={`${styles.tab} ${tab === 'repetition' ? styles.active : ''}`}
            onClick={() => setTab('repetition')}
          >
            <span className={styles.tabIcon}>🔁</span>
            Повторение
          </button>
        </nav>

        <main className={styles.main}>
          {tab === 'dictionary'  && <DictionaryPage />}
          {tab === 'repetition'  && <RepetitionPage />}
        </main>
      </div>
    </WordsProvider>
  );
}
