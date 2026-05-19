import { useParams, Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import { timeAgo } from '@/lib/format';
import type { ApplicationStatus } from '@/types';

const statusOptions: ApplicationStatus[] = ['submitted', 'reviewing', 'interview', 'offered', 'rejected'];

export default function HrJobApplicationsPage() {
  const { id } = useParams<{ id: string }>();
  const { jobs } = useJobs();
  const { applications, updateApplication } = useApplications();

  const job = jobs.find((j) => j.id === id);
  const jobApplications = applications.filter((a) => a.jobId === id);

  if (!job) {
    return (
      <EmptyState
        title="Job not found"
        description="This job may have been removed."
        action={<Link to="/hr/jobs"><Button>Back to jobs</Button></Link>}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Link to="/hr/jobs" style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>← Back to jobs</Link>
        <h1 style={{ fontSize: 24, marginTop: 8, marginBottom: 4 }}>{job.title}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>{jobApplications.length} application{jobApplications.length === 1 ? '' : 's'}</p>
      </div>

      {jobApplications.length === 0 ? (
        <EmptyState title="No applications yet" description="Share this job posting to attract candidates." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jobApplications.map((app) => (
            <Card key={app.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>{app.applicantName}</h3>
                    <Badge tone="primary">{app.status}</Badge>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{app.applicantEmail}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>Applied {timeAgo(app.appliedAt)}</p>
                  {app.coverLetter && (
                    <p style={{ fontSize: 13, marginTop: 8, color: 'var(--color-text)' }}>{app.coverLetter}</p>
                  )}
                </div>
                <select
                  value={app.status}
                  onChange={(e) => updateApplication(app.id, { status: e.target.value as ApplicationStatus })}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
