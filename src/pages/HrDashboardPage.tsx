import { Link } from 'react-router-dom';
import { Briefcase, ClipboardList, ShieldCheck, PlusCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';

export default function HrDashboardPage() {
  const { user } = useAuth();
  const { jobs } = useJobs();
  const { applications } = useApplications();

  const myJobs = jobs.filter((j) => j.postedById === user?.id);
  const openJobs = myJobs.filter((j) => j.status === 'open');
  const pendingApprovals = myJobs.filter((j) => j.approvalStatus === 'pending');
  const totalApplications = applications.filter((a) =>
    myJobs.some((j) => j.id === a.jobId)
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>HR Dashboard</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Welcome back, {user?.fullName}. Here's an overview of your hiring activity.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Briefcase size={22} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{openJobs.length}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Open jobs</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ClipboardList size={22} color="var(--color-info)" />
            <div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{totalApplications}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Applications received</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShieldCheck size={22} color="var(--color-warning)" />
            <div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{pendingApprovals.length}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Pending approvals</div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/hr/jobs/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 13 }}>
          <PlusCircle size={16} /> Post a new job
        </Link>
        <Link to="/hr/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 13 }}>
          Manage jobs
        </Link>
        <Link to="/hr/approvals" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 13 }}>
          Review approvals
        </Link>
      </div>
    </div>
  );
}
