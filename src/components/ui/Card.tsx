import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './Card.module.css';

export default function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx(styles.card, className)}>{children}</div>;
}
