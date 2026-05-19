import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Building2, Clock, MapPin, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { Field, Input, Textarea } from '@/components/ui/Input';
import { formatCurrency, timeAgo } from '@/lib/format';
import styles from './JobDetailPage.module.css';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs } = useJobs();
  const { applications, addApplication } = useApplications();

  const job = jobs.find((j) => j.id === id);

  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    coverLetter: '',
    resumeName: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <EmptyState
        title="Job not found"
        description="This posting may have been closed or removed."
        action={<Link to="/jobs"><Button>Browse jobs</Button></Link>}
      />
    );
  }

  const alreadyApplied = user
    ? applications.some((a) => a.jobId === job.id && a.applicantId === user.id)
    : false;

  const handleApply = (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    addApplication({
      jobId: job.id,
      applicantId: user.id,
      applicantName: form.fullName,
      applicantEmail: form.email,
      coverLetter: form.coverLetter,
      resumeFileName: form.resumeName || 'resume.pdf',
    });
    setSubmitted(true);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{job.title}</h1>
            <Badge tone={job.status === 'open' ? 'success' : 'neutral'}>{job.status.replace('_', ' ')}</Badge>
          </div>
          <div className={styles.meta}>
            <span><Building2 size={14} /> {job.department}</span>
            <span><MapPin size={14} /> {job.location}</span>
            <span><Wallet size={14} /> {formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)}</span>
            <span><Clock size={14} /> {job.employmentType}</span>
          </div>
          <p className={styles.posted}>Posted {timeAgo(job.postedAt)}</p>
        </div>
      </div>

      <div className={styles.grid}>
        <Card className={styles.content}>
          <h2 className={styles.sectionTitle}>About the role</h2>
          <p className={styles.description}>{job.description}</p>
          {job.requirements.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>What we're looking for</h2>
              <ul className={styles.list}>
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <Card className={styles.applyCard}>
          <h2 className={styles.sectionTitle}>Apply for this role</h2>
          {job.status !== 'open' ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
              This posting is not currently accepting applications.
            </p>
          ) : !user ? (
            <div style={{ display: 'grid', gap: 10 }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                Sign in or create an account to apply.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login"><Button variant="secondary">Sign in</Button></Link>
                <Link to="/signup"><Button>Create account</Button></Link>
              </div>
            </div>
          ) : user.role === 'hr' ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
              HR accounts cannot submit applications.
            </p>
          ) : alreadyApplied || submitted ? (
            <div style={{ display: 'grid', gap: 10 }}>
              <Badge tone="success">Application submitted</Badge>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                You'll hear back from the team soon. Track your status in My Applications.
              </p>
              <Link to="/my-applications"><Button variant="secondary">View my applications</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleApply} style={{ display: 'grid', gap: 12 }}>
              <Field label="Full name">
                <Input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </Field>
              <Field label="Email">
                <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="Resume file name" hint="e.g. jordan-resume.pdf">
                <Input value={form.resumeName} onChange={(e) => setForm({ ...form, resumeName: e.target.value })} placeholder="resume.pdf" />
              </Field>
              <Field label="Cover letter">
                <Textarea required value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} placeholder="Tell us why you're a great fit..." />
              </Field>
              <Button type="submit">Submit application</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
