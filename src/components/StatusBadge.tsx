import { WordStatus } from '../types/WordCard';
import styles from './StatusBadge.module.css';

const LABELS: Record<WordStatus, string> = {
  new: 'Новое',
  mistake: 'Ошибка',
  learned: 'Изучено',
};

interface Props {
  status: WordStatus;
}

export function StatusBadge({ status }: Props) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {LABELS[status]}
    </span>
  );
}
