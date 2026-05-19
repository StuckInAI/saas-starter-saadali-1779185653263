import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';
import styles from './AuthPage.module.css';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('public');
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
      setInfo('Your HR account is pending approval. You will be notified once activated.');
      return;
    }
    navigate('/');
  };

  return (
    <div className={styles.wrap}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Join HireFlow as an applicant or HR team member.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Full name">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Jane Doe"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password" hint="At least 6 characters">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </Field>
          <Field label="Account type" error={error || undefined} hint={info || undefined}>
            <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="public">Applicant — apply to jobs</option>
              <option value="hr">HR — post and manage jobs</option>
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
