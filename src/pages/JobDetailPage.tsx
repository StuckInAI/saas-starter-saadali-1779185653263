import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Building2, Clock, MapPin, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Field, Input, Textarea } from '@/components/ui/Input';
import { formatCurrency, timeAgo } from '@/lib/format';
import styles from './JobDetailPage.module.css';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { jobs } = useJobs();
  const { applications, createApplication } = useApplications();
  const navigate = useNavigate();

  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!job) {
    return (
      <div>
        <p>Job not found.</p>
        <Link to="/jobs">← Back to jobs</Link>
      </div>
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
    setSubmitting(true);
    createApplication({
      jobId: job.id,
      applicantId: user.id,
      applicantName: user.fullName,
      applicantEmail: user.email,
      coverLetter,
      resumeFileName: resumeFileName || 'resume.pdf',
    });
    setSubmitting(false);
    setSuccess(true);
    setCoverLetter('');
    setResumeFileName('');
  };

  return (
    <div className={styles.page}>
      <Link to="/jobs" className={styles.back}>← Back to jobs</Link>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h1>{job.title}</h1>
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

      <div className={styles.body}>
        <section>
          <h2>About the role</h2>
          <p className={styles.description}>{job.description}</p>
        </section>

        {job.responsibilities.length > 0 && (
          <section>
            <h2>Responsibilities</h2>
            <ul className={styles.list}>
              {job.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {job.requirements.length > 0 && (
          <section>
            <h2>Requirements</h2>
            <ul className={styles.list}>
              {job.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {job.status === 'open' && (
          <section>
            <h2>Apply</h2>
            {!user ? (
              <Card>
                <p style={{ marginBottom: 'var(--space-3)' }}>Sign in as a job seeker to apply.</p>
                <Link to="/login"><Button>Sign in</Button></Link>
              </Card>
            ) : user.role !== 'public' ? (
              <Card>
                <p>HR accounts cannot apply to jobs.</p>
              </Card>
            ) : alreadyApplied || success ? (
              <Card>
                <p>✅ Your application has been submitted. You can track its status in “My Applications”.</p>
              </Card>
            ) : (
              <Card>
                <form onSubmit={handleApply} style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  <Field label="Resume file name" hint="e.g. jane-doe-resume.pdf">
                    <Input value={resumeFileName} onChange={(e) => setResumeFileName(e.target.value)} placeholder="resume.pdf" />
                  </Field>
                  <Field label="Cover letter">
                    <Textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Tell us why you're a great fit…" />
                  </Field>
                  <div>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Submitting…' : 'Submit application'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
