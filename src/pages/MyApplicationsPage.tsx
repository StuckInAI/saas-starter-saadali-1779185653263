import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { useApplications } from '@/hooks/useApplications';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/hooks/useAuth';
import { timeAgo } from '@/lib/format';

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const { applications } = useApplications();
  const { jobs } = useJobs();

  const mine = applications.filter((a) => a.userId === user?.id);

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 6 }}>My Applications</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>
        Track the status of jobs you've applied to.
      </p>

      {mine.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Browse open roles and submit your first application."
          action={
            <Link to="/jobs">
              <Button>Browse jobs</Button>
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {mine.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            return (
              <Card key={app.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <Link to={`/jobs/${app.jobId}`} style={{ fontSize: 16, fontWeight: 600 }}>
                      {job?.title ?? 'Job no longer available'}
                    </Link>
                    {job && (
                      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
                        {job.department} · {job.location}
                      </p>
                    )}
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>
                      Applied {timeAgo(app.appliedAt)}
                    </p>
                  </div>
                  <Badge tone="primary">{app.status}</Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
