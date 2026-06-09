import { useState } from 'react';
import { WordCard } from '../types/WordCard';
import { StatusBadge } from './StatusBadge';
import { useWords } from '../context/WordsContext';
import styles from './CardItem.module.css';

interface Props {
  card: WordCard;
  onDelete: (id: string) => void;
}

export function CardItem({ card, onDelete }: Props) {
  const { updateCard } = useWords();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  // Edit state
  const [editTranslation, setEditTranslation] = useState(card.translation);
  const [editMeaning, setEditMeaning]         = useState(card.meaning);
  const [editPoS, setEditPoS]                 = useState(card.partOfSpeech);
  const [editExample, setEditExample]         = useState(card.example);

  const date = new Date(card.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short',
  });

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTranslation(card.translation);
    setEditMeaning(card.meaning);
    setEditPoS(card.partOfSpeech);
    setEditExample(card.example);
    setEditing(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCard(card.id, {
      translation: editTranslation.trim() || card.translation,
      meaning:     editMeaning.trim(),
      partOfSpeech: editPoS.trim(),
      example:     editExample.trim(),
    });
    setEditing(false);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(false);
  };

  return (
    <div className={styles.card}>
      {/* ── Header ── */}
      <div className={styles.header} onClick={() => !editing && setExpanded((v) => !v)}>
        <div className={styles.main}>
          <span className={styles.english}>{card.english}</span>
          {card.partOfSpeech && (
            <span className={styles.pos}>{card.partOfSpeech}</span>
          )}
          <StatusBadge status={card.status} />
        </div>
        <div className={styles.meta}>
          <span className={styles.date}>{date}</span>
          {!editing && (
            <span className={`${styles.chevron} ${expanded ? styles.open : ''}`}>›</span>
          )}
        </div>
      </div>

      {/* ── Expanded body ── */}
      {expanded && !editing && (
        <div className={styles.body}>
          <div className={styles.translation}>{card.translation}</div>

          {card.meaning && (
            <div className={styles.meaning}>{card.meaning}</div>
          )}

          {card.example && (
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Пример:</span>
              <span className={styles.exampleText}>{card.example}</span>
            </div>
          )}

          <div className={styles.stats}>
            <span className={styles.correct}>✓ {card.correctAnswers} правильно</span>
            <span className={styles.mistakes}>✗ {card.mistakes} ошибок</span>
          </div>

          <div className={styles.actions}>
            <button className={styles.editBtn} onClick={handleStartEdit}>Редактировать</button>
            <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}>Удалить</button>
          </div>
        </div>
      )}

      {/* ── Edit form ── */}
      {expanded && editing && (
        <div className={styles.body} onClick={(e) => e.stopPropagation()}>
          <label className={styles.fieldLabel}>Перевод</label>
          <input
            className={styles.fieldInput}
            value={editTranslation}
            onChange={(e) => setEditTranslation(e.target.value)}
            placeholder="Перевод на русский..."
          />

          <label className={styles.fieldLabel}>Часть речи</label>
          <input
            className={styles.fieldInput}
            value={editPoS}
            onChange={(e) => setEditPoS(e.target.value)}
            placeholder="noun / verb / adjective..."
          />

          <label className={styles.fieldLabel}>Значение (англ.)</label>
          <textarea
            className={`${styles.fieldInput} ${styles.fieldTextarea}`}
            value={editMeaning}
            onChange={(e) => setEditMeaning(e.target.value)}
            placeholder="English definition..."
            rows={3}
          />

          <label className={styles.fieldLabel}>Пример (англ.)</label>
          <textarea
            className={`${styles.fieldInput} ${styles.fieldTextarea}`}
            value={editExample}
            onChange={(e) => setEditExample(e.target.value)}
            placeholder="Example sentence..."
            rows={2}
          />

          <div className={styles.editActions}>
            <button className={styles.cancelBtn} onClick={handleCancelEdit}>Отмена</button>
            <button className={styles.saveBtn}   onClick={handleSave}>Сохранить</button>
          </div>
        </div>
      )}
    </div>
  );
}
