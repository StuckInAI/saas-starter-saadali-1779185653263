import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Input';
import Card from '@/components/ui/Card';
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
    if (result.user.role === 'hr') {
      navigate('/hr');
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div className={styles.wrap}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your HireFlow account.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </Field>
          <Field label="Password" error={error ?? undefined}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </Field>
          <Button type="submit">Sign in</Button>
        </form>
        <p className={styles.footer}>
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}
