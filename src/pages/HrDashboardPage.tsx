import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function HrDashboardPage() {
  const { user } = useAuth();
  const { jobs } = useJobs();
  const { applications } = useApplications();

  const myJobs = jobs.filter((j) => j.postedBy === user?.id);
  const pendingApprovals = myJobs.filter((j) => j.status === 'pending_approval');
  const openJobs = myJobs.filter((j) => j.status === 'open');
  const myApplications = applications.filter((a) => myJobs.some((j) => j.id === a.jobId));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
        <h1>HR Dashboard</h1>
        <Link to="/hr/jobs/new">
          <Button>Post a new job</Button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>Open roles</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{openJobs.length}</div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>Pending approval</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{pendingApprovals.length}</div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>Applications</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{myApplications.length}</div>
        </Card>
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 'var(--space-3)' }}>Your jobs</h2>
      {myJobs.length === 0 ? (
        <Card>
          <p style={{ color: 'var(--color-text-muted)' }}>
            You haven't posted any jobs yet.{' '}
            <Link to="/hr/jobs/new" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Post your first job
            </Link>
            .
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {myJobs.slice(0, 5).map((j) => (
            <Card key={j.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{j.title}</strong>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                    {j.department} · {j.location} · {j.status}
                  </div>
                </div>
                <Link to={`/hr/jobs/${j.id}/applications`} style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 13 }}>
                  View applications →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
