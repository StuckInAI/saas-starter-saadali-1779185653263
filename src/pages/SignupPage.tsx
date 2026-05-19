import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import styles from './AuthPage.module.css';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'public' | 'hr'>('public');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    const result = signup({ fullName, email, password, role });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (result.needsApproval) {
      setInfo('Your HR account has been created and is pending approval from an existing HR admin.');
      return;
    }

    navigate('/jobs');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Join HireFlow as an applicant or HR team member.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Full name">
            <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
          </Field>
          <Field label="Email">
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </Field>
          <Field label="Password">
            <Input type="password" required minLength={4} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </Field>
          <Field label="I am signing up as" hint="HR accounts require approval before they can sign in.">
            <Select value={role} onChange={(e) => setRole(e.target.value as 'public' | 'hr')}>
              <option value="public">Job seeker</option>
              <option value="hr">HR / Recruiter</option>
            </Select>
          </Field>

          {error && <div className={styles.errorBox}>{error}</div>}
          {info && <div className={styles.infoBox}>{info}</div>}

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className={styles.footnote}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
