import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';

export default function HrDashboardPage() {
  const { user } = useAuth();
  const { jobs } = useJobs();
  const { applications } = useApplications();

  const myJobs = jobs.filter((j) => j.postedBy === user?.id);
  const openJobs = myJobs.filter((j) => j.status === 'open');
  const pendingApprovals = myJobs.filter((j) => j.status === 'pending');
  const myJobIds = new Set(myJobs.map((j) => j.id));
  const relevantApps = applications.filter((a) => myJobIds.has(a.jobId));

  const stats = [
    { label: 'Open Jobs', value: openJobs.length },
    { label: 'Pending Approvals', value: pendingApprovals.length },
    { label: 'Total Applications', value: relevantApps.length },
    { label: 'All My Jobs', value: myJobs.length },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 6 }}>Welcome back, {user?.fullName?.split(' ')[0]}</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>
        Here's an overview of your hiring activity.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map((s) => (
          <Card key={s.label}>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{s.value}</p>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <Card>
          <h2 style={{ fontSize: 16, marginBottom: 12 }}>Quick actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/hr/jobs/new" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 14 }}>+ Post a new job</Link>
            <Link to="/hr/jobs" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 14 }}>Manage existing jobs</Link>
            <Link to="/hr/approvals" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 14 }}>Review pending approvals</Link>
          </div>
        </Card>

        <Card>
          <h2 style={{ fontSize: 16, marginBottom: 12 }}>Recent jobs</h2>
          {myJobs.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>You haven't posted any jobs yet.</p>
          ) : (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myJobs.slice(0, 5).map((j) => (
                <li key={j.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <Link to={`/jobs/${j.id}`} style={{ fontSize: 13, fontWeight: 500 }}>{j.title}</Link>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{j.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
