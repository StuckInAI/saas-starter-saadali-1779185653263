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
  const myJobIds = new Set(myJobs.map((j) => j.id));
  const myApplications = applications.filter((a) => myJobIds.has(a.jobId));

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Welcome back, {user?.fullName.split(' ')[0]}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Here's a snapshot of your hiring pipeline.</p>
        </div>
        <Link to="/hr/jobs/new">
          <Button>Post a new job</Button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 12, fontWeight: 600 }}>OPEN JOBS</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{openJobs.length}</div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 12, fontWeight: 600 }}>PENDING APPROVAL</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{pendingApprovals.length}</div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 12, fontWeight: 600 }}>APPLICATIONS</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{myApplications.length}</div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 12, fontWeight: 600 }}>TOTAL JOBS</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{myJobs.length}</div>
        </Card>
      </div>

      <Card>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Quick actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/hr/jobs"><Button variant="secondary">Manage jobs</Button></Link>
          <Link to="/hr/jobs/new"><Button variant="secondary">Post a job</Button></Link>
          <Link to="/hr/approvals"><Button variant="secondary">Review approvals</Button></Link>
        </div>
      </Card>
    </div>
  );
}
