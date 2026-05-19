import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} HireFlow · Built for modern HR teams</span>
      </footer>
    </div>
  );
}
