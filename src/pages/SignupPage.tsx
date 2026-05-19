import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'public' | 'hr'>('public');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const result = signup({ fullName, email, password, role });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.needsApproval) {
      setInfo('Your HR account has been created and is pending approval. You can sign in now.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 460, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, marginBottom: 6, textAlign: 'center' }}>Create your account</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24, textAlign: 'center' }}>
        Join HireFlow as an applicant or HR teammate.
      </p>

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <Field label="Full name">
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </Field>
          <Field label="Password" hint="At least 6 characters">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
          </Field>
          <Field label="Account type">
            <Select value={role} onChange={(e) => setRole(e.target.value as 'public' | 'hr')}>
              <option value="public">Applicant</option>
              <option value="hr">HR / Hiring Manager</option>
            </Select>
          </Field>

          {error && (
            <p style={{ color: 'var(--color-danger)', fontSize: 13, fontWeight: 500 }}>{error}</p>
          )}
          {info && (
            <p style={{ color: 'var(--color-success)', fontSize: 13, fontWeight: 500 }}>{info}</p>
          )}

          <Button type="submit">Create account</Button>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
