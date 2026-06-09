import { useState } from 'react';
import { WordCard } from '../types/WordCard';
import { StatusBadge } from './StatusBadge';
import styles from './CardItem.module.css';

interface Props {
  card: WordCard;
  onDelete: (id: string) => void;
}

export function CardItem({ card, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(card.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={() => setExpanded((v) => !v)}>
        <div className={styles.main}>
          <span className={styles.english}>{card.english}</span>
          <StatusBadge status={card.status} />
        </div>
        <div className={styles.meta}>
          <span className={styles.date}>{date}</span>
          <span className={`${styles.chevron} ${expanded ? styles.open : ''}`}>›</span>
        </div>
      </div>

      {expanded && (
        <div className={styles.body}>
          <div className={styles.translation}>{card.translation}</div>
          <div className={styles.meaning}>{card.meaning}</div>
          <div className={styles.stats}>
            <span className={styles.correct}>✓ {card.correctAnswers} правильно</span>
            <span className={styles.mistakes}>✗ {card.mistakes} ошибок</span>
          </div>
          <button
            className={styles.deleteBtn}
            onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}
