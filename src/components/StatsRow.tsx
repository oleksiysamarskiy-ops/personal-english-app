import { WordCard } from '../types/WordCard';
import styles from './StatsRow.module.css';

interface Props { cards: WordCard[]; }

export function StatsRow({ cards }: Props) {
  const learned      = cards.filter((c) => c.status === 'learned').length;
  const newCount     = cards.filter((c) => c.status === 'new').length;
  const mistakes     = cards.filter((c) => c.status === 'mistake').length;
  const totalCorrect = cards.reduce((s, c) => s + c.correctAnswers, 0);
  const totalErr     = cards.reduce((s, c) => s + c.mistakes, 0);

  return (
    <div className={styles.row}>
      <Stat value={newCount}     label="Новых"       color="#6C63FF" />
      <Stat value={mistakes}     label="С ошибками"  color="#FF5252" />
      <Stat value={learned}      label="Изучено"     color="#00C896" />
      <Stat value={totalCorrect} label="Правильных"  color="#00C896" />
      <Stat value={totalErr}     label="Ошибок"      color="#FF5252" />
    </div>
  );
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.value} style={{ color }}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
