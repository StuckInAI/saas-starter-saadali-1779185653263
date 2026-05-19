import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, UserCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo}>
            <Briefcase size={18} />
          </span>
          <span className={styles.brandName}>HireFlow</span>
        </Link>

        <nav className={styles.nav}>
          <NavLink to="/jobs" className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}>
            Browse Jobs
          </NavLink>
          {user?.role === 'public' && (
            <NavLink to="/my-applications" className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}>
              My Applications
            </NavLink>
          )}
          {user?.role === 'hr' && (
            <>
              <NavLink to="/hr" end className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}>
                Dashboard
              </NavLink>
              <NavLink to="/hr/jobs" className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}>
                Manage Jobs
              </NavLink>
              <NavLink to="/hr/approvals" className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}>
                Approvals
              </NavLink>
            </>
          )}
        </nav>

        <div className={styles.actions}>
          {user ? (
            <>
              <span className={styles.userBadge}>
                <UserCircle2 size={18} />
                <span>
                  <strong>{user.fullName}</strong>
                  <span className={styles.roleTag}>{user.role === 'hr' ? 'HR' : 'Applicant'}</span>
                </span>
              </span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.linkBtn}>Sign in</Link>
              <Link to="/signup" className={styles.primaryBtn}>Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
