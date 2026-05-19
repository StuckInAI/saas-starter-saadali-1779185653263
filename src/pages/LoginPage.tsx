import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Field, Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
        <p className={styles.subtitle}>Sign in to continue to HireFlow</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </Field>
          {error && <div className={styles.error}>{error}</div>}
          <Button type="submit">Sign in</Button>
        </form>

        <div className={styles.helper}>
          New here? <Link to="/signup">Create an account</Link>
        </div>

        <div className={styles.demoBox}>
          <strong>Demo accounts</strong>
          <span>Admin / HR: <code>admin@hireflow.app</code> / <code>admin123</code></span>
          <span>HR: <code>sara.hr@hireflow.app</code> / <code>password</code></span>
        </div>
      </Card>
    </div>
  );
}
