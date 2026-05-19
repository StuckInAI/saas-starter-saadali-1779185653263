import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/format';

export default function HrJobsPage() {
  const { user } = useAuth();
  const { jobs, deleteJob, updateJob } = useJobs();
  const { applications } = useApplications();

  const myJobs = jobs.filter((j) => j.postedBy === user?.id);

  if (myJobs.length === 0) {
    return (
      <div>
        <h1 style={{ marginBottom: 'var(--space-5)' }}>Manage jobs</h1>
        <EmptyState
          title="You haven't posted any jobs yet"
          description="Create your first job posting to start receiving applications."
          action={
            <Link to="/hr/jobs/new">
              <Button>Post a new job</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
        <h1>Manage jobs</h1>
        <Link to="/hr/jobs/new">
          <Button>Post a new job</Button>
        </Link>
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        {myJobs.map((job) => {
          const count = applications.filter((a) => a.jobId === job.id).length;
          return (
            <Card key={job.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                    <strong>{job.title}</strong>
                    <Badge tone={job.status === 'open' ? 'success' : job.status === 'pending_approval' ? 'warning' : 'neutral'}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                    {job.department} · {job.location} · Posted {formatDate(job.postedAt)}
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 4 }}>
                    {count} application{count === 1 ? '' : 's'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <Link to={`/hr/jobs/${job.id}/applications`}>
                    <Button variant="secondary">View applications</Button>
                  </Link>
                  {job.status === 'open' ? (
                    <Button variant="ghost" onClick={() => updateJob(job.id, { status: 'closed' })}>
                      Close
                    </Button>
                  ) : job.status === 'closed' ? (
                    <Button variant="ghost" onClick={() => updateJob(job.id, { status: 'open' })}>
                      Reopen
                    </Button>
                  ) : null}
                  <Button variant="danger" onClick={() => deleteJob(job.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
