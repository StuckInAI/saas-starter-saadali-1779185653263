import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
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
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, marginBottom: 6, textAlign: 'center' }}>Sign in</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24, textAlign: 'center' }}>
        Welcome back to HireFlow.
      </p>

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </Field>
          <Field label="Password" error={error || undefined}>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </Field>
          <Button type="submit">Sign in</Button>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Create one</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
