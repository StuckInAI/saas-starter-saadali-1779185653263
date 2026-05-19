import { useParams, Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Field, Select } from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import { timeAgo } from '@/lib/format';
import type { ApplicationStatus } from '@/types';

const statusOptions: ApplicationStatus[] = ['applied', 'reviewing', 'interviewed', 'hired', 'rejected'];

export default function HrJobApplicationsPage() {
  const { id } = useParams();
  const { jobs } = useJobs();
  const { applications, updateStatus } = useApplications();

  const job = jobs.find((j) => j.id === id);
  const jobApps = applications.filter((a) => a.jobId === id);

  if (!job) {
    return (
      <EmptyState
        title="Job not found"
        description="The job you're looking for doesn't exist or has been removed."
      />
    );
  }

  return (
    <div>
      <Link to="/hr/jobs" style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>← Back to jobs</Link>
      <h1 style={{ fontSize: 24, marginTop: 8, marginBottom: 6 }}>{job.title}</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>
        {jobApps.length} application{jobApps.length === 1 ? '' : 's'} received
      </p>

      {jobApps.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Once candidates apply, they'll appear here for review."
        />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {jobApps.map((app) => (
            <Card key={app.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>{app.fullName}</h3>
                    <Badge tone="neutral">{app.status}</Badge>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{app.email}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>Applied {timeAgo(app.appliedAt)}</p>
                  {app.coverLetter && (
                    <p style={{ fontSize: 13, marginTop: 10, whiteSpace: 'pre-wrap' }}>{app.coverLetter}</p>
                  )}
                </div>
                <div style={{ minWidth: 180 }}>
                  <Field label="Status">
                    <Select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
