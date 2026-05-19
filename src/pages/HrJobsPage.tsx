import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, timeAgo } from '@/lib/format';

export default function HrJobsPage() {
  const { user } = useAuth();
  const { jobs, updateJob } = useJobs();
  const { applications } = useApplications();

  const myJobs = jobs.filter((j) => j.postedById === user?.id);

  const toggleStatus = (jobId: string, current: 'open' | 'closed') => {
    updateJob(jobId, { status: current === 'open' ? 'closed' : 'open' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Manage Jobs</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Edit, close, or review applications for jobs you posted.</p>
        </div>
        <Link to="/hr/jobs/new">
          <Button><PlusCircle size={16} /> Post new job</Button>
        </Link>
      </div>

      {myJobs.length === 0 ? (
        <EmptyState
          title="No jobs yet"
          description="Post your first job to start receiving applications."
          action={<Link to="/hr/jobs/new"><Button>Post a job</Button></Link>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myJobs.map((job) => {
            const appCount = applications.filter((a) => a.jobId === job.id).length;
            return (
              <Card key={job.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600 }}>{job.title}</h3>
                      <Badge tone={job.status === 'open' ? 'success' : 'neutral'}>{job.status}</Badge>
                      <Badge tone={job.approvalStatus === 'approved' ? 'primary' : job.approvalStatus === 'pending' ? 'warning' : 'danger'}>
                        {job.approvalStatus}
                      </Badge>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                      {job.department} · {job.location} · {formatCurrency(job.salaryMin)}–{formatCurrency(job.salaryMax)}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                      Posted {timeAgo(job.postedAt)} · {appCount} application{appCount === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Link to={`/hr/jobs/${job.id}/applications`}>
                      <Button variant="secondary" size="sm">View applications</Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(job.id, job.status)}>
                      {job.status === 'open' ? 'Close' : 'Reopen'}
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
