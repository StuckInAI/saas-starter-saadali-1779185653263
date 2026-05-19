import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, CheckCircle2, Clock, MapPin, Wallet } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Field, Input, Textarea } from '@/components/ui/Input';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/lib/format';
import styles from './JobDetailPage.module.css';

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeName: string;
  resumeDataUrl: string;
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { jobs } = useJobs();
  const { applications, createApplication } = useApplications();
  const { user } = useAuth();
  const navigate = useNavigate();

  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  const alreadyApplied = useMemo(() => {
    if (!job || !user) return false;
    return applications.some((a) => a.jobId === job.id && a.email.toLowerCase() === user.email.toLowerCase());
  }, [applications, job, user]);

  const [form, setForm] = useState<FormState>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    coverLetter: '',
    resumeName: '',
    resumeDataUrl: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <div className={styles.notFound}>
        <h2>Job not found</h2>
        <p>The position you're looking for may have been removed.</p>
        <Link to="/jobs" className={styles.backLink}><ArrowLeft size={14} /> Back to jobs</Link>
      </div>
    );
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, resumeName: 'File must be under 5MB.' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, resumeName: file.name, resumeDataUrl: String(reader.result || '') }));
      setErrors((p) => ({ ...p, resumeName: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (!form.resumeName) next.resumeName = 'Please attach your resume.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    createApplication({
      jobId: job.id,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      coverLetter: form.coverLetter,
      resumeName: form.resumeName,
      resumeDataUrl: form.resumeDataUrl,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.successWrap}>
        <div className={styles.successIcon}><CheckCircle2 size={40} /></div>
        <h2>Application submitted!</h2>
        <p>Thanks for applying to <strong>{job.title}</strong>. We'll be in touch soon.</p>
        <div className={styles.successActions}>
          <Button onClick={() => navigate('/jobs')}>Browse more jobs</Button>
          {user?.role === 'public' && (
            <Button variant="secondary" onClick={() => navigate('/my-applications')}>View my applications</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <Link to="/jobs" className={styles.back}><ArrowLeft size={14} /> All jobs</Link>

      <div className={styles.grid}>
        <div className={styles.main}>
          <Card>
            <div className={styles.headerRow}>
              <div>
                <h1 className={styles.title}>{job.title}</h1>
                <p className={styles.dept}><Building2 size={14} /> {job.department}</p>
              </div>
              <Badge tone={job.status === 'open' ? 'success' : 'neutral'}>{job.status}</Badge>
            </div>

            <div className={styles.meta}>
              <span><MapPin size={14} />{job.location}</span>
              <span><Wallet size={14} />{formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)}</span>
              <span><Clock size={14} />{job.employmentType}</span>
              <span><Calendar size={14} />Apply by {formatDate(job.deadline)}</span>
            </div>

            <section className={styles.section}>
              <h3>About the role</h3>
              <p className={styles.body}>{job.description}</p>
            </section>

            <section className={styles.section}>
              <h3>Requirements</h3>
              <p className={styles.body}>{job.requirements}</p>
            </section>
          </Card>
        </div>

        <aside className={styles.aside}>
          <Card>
            <h3 className={styles.applyTitle}>Apply for this role</h3>
            <p className={styles.applyHint}>
              {user?.role === 'public' ? 'Submit your application below.' : 'No account required — apply as a guest.'}
            </p>

            {alreadyApplied ? (
              <div className={styles.appliedNote}>
                <CheckCircle2 size={18} />
                <span>You've already applied to this role.</span>
              </div>
            ) : user?.role === 'hr' ? (
              <p className={styles.hrNote}>HR accounts cannot apply to jobs.</p>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <Field label="Full name" error={errors.fullName}>
                  <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Jane Doe" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 0000" />
                </Field>
                <Field label="Cover letter" hint="Optional — tell us why you're a fit.">
                  <Textarea value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} placeholder="I'm excited about this role because..." />
                </Field>
                <Field label="Resume / CV" error={errors.resumeName} hint="PDF, DOC, or DOCX up to 5MB">
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className={styles.fileInput} />
                  {form.resumeName && <span className={styles.fileName}>📎 {form.resumeName}</span>}
                </Field>
                <Button type="submit">Submit application</Button>
              </form>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
