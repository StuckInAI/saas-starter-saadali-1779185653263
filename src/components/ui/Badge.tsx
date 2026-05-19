import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export default function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={clsx(styles.badge, styles[tone])}>{children}</span>;
}
