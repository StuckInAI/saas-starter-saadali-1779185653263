import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import type { UserRole } from '@/types';
import styles from './AuthPage.module.css';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('public');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = signup({ fullName, email, password, role });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.needsApproval) {
      setPending(true);
      return;
    }
    navigate('/');
  };

  if (pending) {
    return (
      <div className={styles.wrap}>
        <Card className={styles.card}>
          <h1 className={styles.title}>Account pending approval</h1>
          <p className={styles.subtitle}>
            Your HR account has been created and is awaiting approval from an existing admin. You'll be able to sign in once approved.
          </p>
          <Link to="/login"><Button>Back to sign in</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>Join HireFlow to apply for roles or hire great people.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Full name">
            <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </Field>
          <Field label="Password" error={error ?? undefined}>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Field label="I am a...">
            <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="public">Job seeker</option>
              <option value="hr">HR / Recruiter</option>
            </Select>
          </Field>
          <Button type="submit">Create account</Button>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
