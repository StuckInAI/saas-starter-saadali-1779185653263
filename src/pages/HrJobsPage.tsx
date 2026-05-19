import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/format';

export default function HrJobsPage() {
  const { user } = useAuth();
  const { jobs, updateJob, deleteJob } = useJobs();
  const { applications } = useApplications();

  const myJobs = jobs.filter((j) => j.postedBy === user?.id);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Manage jobs</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Review postings, applications, and statuses.</p>
        </div>
        <Link to="/hr/jobs/new"><Button>Post a new job</Button></Link>
      </div>

      {myJobs.length === 0 ? (
        <EmptyState
          title="You haven't posted any jobs"
          description="Create your first job posting to start receiving applications."
          action={<Link to="/hr/jobs/new"><Button>Post a job</Button></Link>}
        />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {myJobs.map((job) => {
            const count = applications.filter((a) => a.jobId === job.id).length;
            return (
              <Card key={job.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
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
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Link to={`/hr/jobs/${job.id}/applications`}>
                      <Button variant="secondary" size="sm">View applications</Button>
                    </Link>
                    {job.status === 'open' ? (
                      <Button variant="secondary" size="sm" onClick={() => updateJob(job.id, { status: 'closed' })}>
                        Close
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={() => updateJob(job.id, { status: 'open' })}>
                        Reopen
                      </Button>
                    )}
                    <Button variant="danger" size="sm" onClick={() => deleteJob(job.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
