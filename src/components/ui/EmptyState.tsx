import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import styles from './EmptyState.module.css';

export default function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>
        <Inbox size={22} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.desc}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
