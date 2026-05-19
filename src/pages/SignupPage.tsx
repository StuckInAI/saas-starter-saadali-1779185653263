import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import type { Role } from '@/types';
import styles from './AuthPage.module.css';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('public');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const result = signup({ fullName, email, password, role });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.needsApproval) {
      setInfo(
        'Your HR access request was submitted. An existing HR administrator will need to approve it before you can sign in.',
      );
      return;
    }
    navigate('/jobs');
  };

  return (
    <div className={styles.wrap}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Join HireFlow to apply for roles or manage hiring.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Full name">
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </Field>
          <Field label="Password" error={error ?? undefined}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </Field>
          <Field label="I am signing up as" hint="HR accounts require approval from an existing HR admin.">
            <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="public">Job applicant</option>
              <option value="hr">HR / Recruiter</option>
            </Select>
          </Field>
          {info && <p className={styles.info}>{info}</p>}
          <Button type="submit">Create account</Button>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
