import { useParams } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Input';
import { formatDate } from '@/lib/format';
import type { ApplicationStatus } from '@/types';

const statusOptions: ApplicationStatus[] = ['submitted', 'reviewing', 'interview', 'hired', 'rejected'];

const toneFor = (status: ApplicationStatus) => {
  switch (status) {
    case 'hired':
      return 'success' as const;
    case 'rejected':
      return 'danger' as const;
    case 'interview':
      return 'info' as const;
    case 'reviewing':
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
};

export default function HrJobApplicationsPage() {
  const { id } = useParams<{ id: string }>();
  const { jobs } = useJobs();
  const { applications, updateApplication } = useApplications();

  const job = jobs.find((j) => j.id === id);
  const jobApplications = applications.filter((a) => a.jobId === id);

  if (!job) {
    return <EmptyState title="Job not found" description="The job you're looking for may have been removed." />;
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>{job.title}</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
          {jobApplications.length} application{jobApplications.length === 1 ? '' : 's'} received
        </p>
      </div>

      {jobApplications.length === 0 ? (
        <EmptyState title="No applications yet" description="Share your job posting to attract candidates." />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {jobApplications.map((app) => (
            <Card key={app.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <strong>{app.applicantName}</strong>
                    <Badge tone={toneFor(app.status)}>{app.status}</Badge>
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{app.applicantEmail}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 4 }}>
                    Applied {formatDate(app.appliedAt)} · Resume: {app.resumeFileName}
                  </div>
                  <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.5 }}>{app.coverLetter}</p>
                </div>
                <div style={{ minWidth: 180 }}>
                  <Select
                    value={app.status}
                    onChange={(e) => updateApplication(app.id, { status: e.target.value as ApplicationStatus })}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
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
