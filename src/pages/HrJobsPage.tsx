import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { timeAgo, formatCurrency } from '@/lib/format';

export default function HrJobsPage() {
  const { user } = useAuth();
  const { jobs, updateJob } = useJobs();
  const { applications } = useApplications();

  const myJobs = jobs.filter((j) => j.postedBy === user?.id);

  const countFor = (jobId: string) => applications.filter((a) => a.jobId === jobId).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 6 }}>Manage Jobs</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
            Edit, close, or review applications for your job postings.
          </p>
        </div>
        <Link to="/hr/jobs/new">
          <Button>+ Post a job</Button>
        </Link>
      </div>

      {myJobs.length === 0 ? (
        <EmptyState
          title="No jobs yet"
          description="Post your first job to start collecting applications."
          action={
            <Link to="/hr/jobs/new">
              <Button>Post a job</Button>
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {myJobs.map((job) => (
            <Card key={job.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Link to={`/jobs/${job.id}`} style={{ fontSize: 16, fontWeight: 600 }}>{job.title}</Link>
                    <Badge tone={job.status === 'open' ? 'success' : job.status === 'pending' ? 'warning' : 'neutral'}>
                      {job.status}
                    </Badge>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
                    {job.department} · {job.location} · {formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>
                    Posted {timeAgo(job.postedAt)} · {countFor(job.id)} application{countFor(job.id) === 1 ? '' : 's'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Link to={`/hr/jobs/${job.id}/applications`}>
                    <Button size="sm" variant="secondary">View applications</Button>
                  </Link>
                  {job.status === 'open' ? (
                    <Button size="sm" variant="ghost" onClick={() => updateJob(job.id, { status: 'closed' })}>Close</Button>
                  ) : job.status === 'closed' ? (
                    <Button size="sm" variant="ghost" onClick={() => updateJob(job.id, { status: 'open' })}>Reopen</Button>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
