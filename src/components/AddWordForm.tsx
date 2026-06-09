import { useState } from 'react';
import { useWords } from '../context/WordsContext';
import { translateWord } from '../utils/translator';
import styles from './AddWordForm.module.css';

export function AddWordForm() {
  const { addCard } = useWords();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed) { setError('Введите слово или фразу'); return; }
    setError('');
    setLoading(true);
    try {
      const result = await translateWord(trimmed);
      addCard({ english: trimmed, translation: result.translation, meaning: result.meaning });
      setInput('');
    } catch {
      setError('Не удалось получить перевод. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.inputRow}>
        <input
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          type="text"
          placeholder="Введите английское слово или фразу..."
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          disabled={loading}
          autoFocus
        />
        <button
          className={styles.btn}
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
        >
          {loading ? <span className={styles.spinner} /> : 'Добавить'}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
