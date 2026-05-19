import { useParams } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/format';
import type { ApplicationStatus } from '@/types';

const STATUS_OPTIONS: ApplicationStatus[] = ['submitted', 'under_review', 'interview', 'offer', 'rejected'];

function toneFor(status: ApplicationStatus) {
  switch (status) {
    case 'submitted':
      return 'info' as const;
    case 'under_review':
      return 'warning' as const;
    case 'interview':
      return 'primary' as const;
    case 'offer':
      return 'success' as const;
    case 'rejected':
      return 'danger' as const;
  }
}

export default function HrJobApplicationsPage() {
  const { id } = useParams<{ id: string }>();
  const { jobs } = useJobs();
  const { applications, updateApplication } = useApplications();

  const job = jobs.find((j) => j.id === id);
  const jobApps = applications.filter((a) => a.jobId === id);

  if (!job) {
    return <EmptyState title="Job not found" />;
  }

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-2)' }}>{job.title}</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)' }}>
        {job.department} · {job.location} · {jobApps.length} application{jobApps.length === 1 ? '' : 's'}
      </p>

      {jobApps.length === 0 ? (
        <EmptyState title="No applications yet" description="Once candidates apply, you'll see them here." />
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {jobApps.map((app) => (
            <Card key={app.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                    <strong>{app.applicantName}</strong>
                    <Badge tone={toneFor(app.status)}>{app.status.replace('_', ' ')}</Badge>
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 'var(--space-2)' }}>
                    {app.applicantEmail}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    Applied {formatDate(app.appliedAt)} · Resume: {app.resumeFileName}
                  </div>
                  {app.coverLetter && (
                    <p style={{ marginTop: 'var(--space-3)', fontSize: 13, whiteSpace: 'pre-wrap' }}>{app.coverLetter}</p>
                  )}
                </div>
                <div style={{ minWidth: 180 }}>
                  <Select
                    value={app.status}
                    onChange={(e) =>
                      updateApplication(app.id, { status: e.target.value as ApplicationStatus })
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
