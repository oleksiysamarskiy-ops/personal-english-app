import { useState } from 'react';
import { useWords } from '../context/WordsContext';
import { useRepetitionQueue } from '../hooks/useRepetitionQueue';
import { StatsRow } from '../components/StatsRow';
import styles from './RepetitionPage.module.css';

export function RepetitionPage() {
  const { cards, markCorrect, markMistake } = useWords();
  const { current, advance } = useRepetitionQueue(cards);
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'mistake' | null>(null);

  const handleCorrect = () => {
    if (!current) return;
    markCorrect(current.id);
    setFeedback('correct');
    setTimeout(() => { setFeedback(null); setRevealed(false); advance(); }, 650);
  };

  const handleMistake = () => {
    if (!current) return;
    markMistake(current.id);
    setFeedback('mistake');
    setTimeout(() => { setFeedback(null); setRevealed(false); advance(); }, 650);
  };

  if (cards.length === 0) {
    return (
      <div className={styles.page}>
        <StatsRow cards={cards} />
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎯</div>
          <div className={styles.emptyTitle}>Нечего повторять</div>
          <div className={styles.emptyText}>Добавьте слова в словарь, чтобы начать обучение</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <StatsRow cards={cards} />

      <div
        className={[
          styles.card,
          feedback === 'correct' ? styles.cardCorrect : '',
          feedback === 'mistake' ? styles.cardMistake : '',
        ].join(' ')}
      >
        <div className={styles.statusHint}>
          {current?.status === 'new'     && <span className={styles.hintNew}>Новое слово</span>}
          {current?.status === 'mistake' && <span className={styles.hintMistake}>Исправьте ошибку</span>}
          {current?.status === 'learned' && <span className={styles.hintLearned}>Повторение</span>}
        </div>

        {current?.partOfSpeech && (
          <div className={styles.posHint}>{current.partOfSpeech}</div>
        )}

        <div className={styles.word}>{current?.english}</div>

        {!revealed && !feedback && (
          <button className={styles.revealBtn} onClick={() => setRevealed(true)}>
            Показать ответ
          </button>
        )}

        {revealed && !feedback && (
          <div className={styles.answer}>
            <div className={styles.translation}>{current?.translation}</div>

            {current?.meaning && (
              <div className={styles.meaning}>{current.meaning}</div>
            )}

            {current?.example && (
              <div className={styles.example}>
                <span className={styles.exampleLabel}>Пример</span>
                <span className={styles.exampleText}>{current.example}</span>
              </div>
            )}

            <div className={styles.actions}>
              <button className={styles.mistakeBtn} onClick={handleMistake}>✗ Ошибка</button>
              <button className={styles.correctBtn} onClick={handleCorrect}>✓ Правильно</button>
            </div>
          </div>
        )}

        {feedback === 'correct' && <div className={styles.feedbackOk}>Отлично! ✓</div>}
        {feedback === 'mistake'  && <div className={styles.feedbackErr}>Запомните! ✗</div>}
      </div>
    </div>
  );
}
