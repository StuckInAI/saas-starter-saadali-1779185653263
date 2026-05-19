import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { useJobs } from '@/hooks/useJobs';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/format';

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const { applications } = useApplications();
  const { jobs } = useJobs();

  const mine = applications.filter((a) => a.applicantId === user?.id);

  if (mine.length === 0) {
    return (
      <EmptyState
        title="No applications yet"
        description="Browse open roles and submit your first application."
        action={
          <Link to="/jobs">
            <Button>Browse jobs</Button>
          </Link>
        }
      />
    );
  }

  const toneFor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'info' as const;
      case 'reviewed':
        return 'primary' as const;
      case 'shortlisted':
        return 'success' as const;
      case 'rejected':
        return 'danger' as const;
      default:
        return 'neutral' as const;
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-5)' }}>My Applications</h1>
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        {mine.map((app) => {
          const job = jobs.find((j) => j.id === app.jobId);
          return (
            <Card key={app.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <div>
                  <h3 style={{ fontSize: 16, marginBottom: 4 }}>
                    {job ? (
                      <Link to={`/jobs/${job.id}`} style={{ color: 'var(--color-text)' }}>
                        {job.title}
                      </Link>
                    ) : (
                      'Job no longer available'
                    )}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                    Applied {formatDate(app.submittedAt)}
                  </p>
                </div>
                <Badge tone={toneFor(app.status)}>{app.status}</Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
