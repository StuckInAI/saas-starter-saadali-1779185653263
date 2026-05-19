import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Field, Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';
import styles from './AuthPage.module.css';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('public');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const result = signup({ fullName, email, password, role });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.needsApproval) {
      setNotice('Your HR account has been submitted and is pending admin approval. You will be able to sign in once approved.');
      return;
    }
    navigate('/');
  };

  return (
    <div className={styles.wrap}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Choose the account type that fits you.</p>

        <div className={styles.roleToggle}>
          <button
            type="button"
            className={clsx(styles.roleBtn, role === 'public' && styles.roleBtnActive)}
            onClick={() => setRole('public')}
          >
            <strong>Job seeker</strong>
            <span>Apply to roles & track applications.</span>
          </button>
          <button
            type="button"
            className={clsx(styles.roleBtn, role === 'hr' && styles.roleBtnActive)}
            onClick={() => setRole('hr')}
          >
            <strong>HR / Recruiter</strong>
            <span>Post jobs & manage applicants. Requires admin approval.</span>
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Field label="Full name">
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" required />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
          </Field>
          <Field label="Password" hint="Minimum 6 characters">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </Field>
          {error && <div className={styles.error}>{error}</div>}
          {notice && <div className={styles.notice}>{notice}</div>}
          <Button type="submit">Create account</Button>
        </form>

        <div className={styles.helper}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </Card>
    </div>
  );
}
