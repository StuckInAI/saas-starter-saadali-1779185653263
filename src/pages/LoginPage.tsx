import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Input';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/');
  };

  return (
    <div className={styles.wrap}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to manage your applications or postings.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Email">
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </Field>
          <Field label="Password" error={error ?? undefined}>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Button type="submit">Sign in</Button>
        </form>
        <p className={styles.footer}>
          New here? <Link to="/signup">Create an account</Link>
        </p>
        <div className={styles.hint}>
          <strong>Demo accounts:</strong>
          <div>HR · hr@hireflow.test / password</div>
          <div>Applicant · applicant@hireflow.test / password</div>
        </div>
      </Card>
    </div>
  );
}
