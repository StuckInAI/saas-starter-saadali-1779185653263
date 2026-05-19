import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useApplications } from '@/hooks/useApplications';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/hooks/useAuth';
import { timeAgo } from '@/lib/format';

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const { applications } = useApplications();
  const { jobs } = useJobs();

  const mine = applications.filter((a) => a.applicantId === user?.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>My Applications</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Track the status of jobs you've applied to.</p>
      </div>

      {mine.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Start by browsing open roles and submit your first application."
          action={<Link to="/jobs"><Button>Browse jobs</Button></Link>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mine.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            return (
              <Card key={app.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600 }}>{job?.title ?? 'Job no longer available'}</h3>
                      <Badge tone="primary">{app.status}</Badge>
                    </div>
                    {job && (
                      <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                        {job.department} · {job.location}
                      </p>
                    )}
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>Applied {timeAgo(app.appliedAt)}</p>
                  </div>
                  {job && (
                    <Link to={`/jobs/${job.id}`}>
                      <Button variant="secondary" size="sm">View job</Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
