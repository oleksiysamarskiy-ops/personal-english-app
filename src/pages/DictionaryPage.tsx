import { useState } from 'react';
import { useWords } from '../context/WordsContext';
import { AddWordForm } from '../components/AddWordForm';
import { CardItem } from '../components/CardItem';
import { WordStatus } from '../types/WordCard';
import styles from './DictionaryPage.module.css';

type Filter = 'all' | WordStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',     label: 'Все' },
  { key: 'new',     label: 'Новые' },
  { key: 'mistake', label: 'С ошибками' },
  { key: 'learned', label: 'Изученные' },
];

function declWord(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return 'карточка';
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'карточки';
  return 'карточек';
}

export function DictionaryPage() {
  const { cards, deleteCard } = useWords();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = cards
    .filter((c) => filter === 'all' || c.status === filter)
    .filter((c) =>
      !search ||
      c.english.toLowerCase().includes(search.toLowerCase()) ||
      c.translation.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className={styles.page}>
      <AddWordForm />

      {cards.length > 0 ? (
        <>
          <div className={styles.controls}>
            <input
              className={styles.search}
              type="text"
              placeholder="Поиск по слову или переводу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className={styles.filters}>
              {FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  className={`${styles.filterBtn} ${filter === key ? styles.active : ''}`}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.count}>
            {filtered.length} {declWord(filtered.length)}
          </div>

          <div className={styles.list}>
            {filtered.length === 0
              ? <div className={styles.empty}>Ничего не найдено</div>
              : filtered.map((card) => (
                  <CardItem key={card.id} card={card} onDelete={deleteCard} />
                ))
            }
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <div className={styles.emptyTitle}>Словарь пуст</div>
          <div className={styles.emptyText}>
            Добавьте первое слово, чтобы начать учить английский
          </div>
        </div>
      )}
    </div>
  );
}
