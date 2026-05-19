import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';

export default function HrApprovalsPage() {
  const { jobs, updateJob } = useJobs();
  const { users, approveUser, rejectUser } = useAuth();
  const pending = jobs.filter((j) => j.status === 'pending_approval');
  const pendingHr = users.filter((u) => u.role === 'hr' && !u.approved);

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>Approvals</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
          Review pending HR signups and job postings.
        </p>
      </div>

      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ fontSize: 16 }}>Pending HR accounts</h2>
        {pendingHr.length === 0 ? (
          <EmptyState title="No pending HR accounts" description="New HR signups will appear here for approval." />
        ) : (
          pendingHr.map((u) => (
            <Card key={u.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <strong>{u.fullName}</strong>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{u.email}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="secondary" size="sm" onClick={() => rejectUser(u.id)}>Reject</Button>
                  <Button size="sm" onClick={() => approveUser(u.id)}>Approve</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </section>

      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ fontSize: 16 }}>Pending job postings</h2>
        {pending.length === 0 ? (
          <EmptyState title="No jobs awaiting approval" description="Newly drafted jobs that require review will show up here." />
        ) : (
          pending.map((j) => (
            <Card key={j.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <strong>{j.title}</strong>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{j.department} · {j.location}</div>
                  <div style={{ marginTop: 6 }}><Badge tone="warning">pending approval</Badge></div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="secondary" size="sm" onClick={() => updateJob(j.id, { status: 'closed' })}>Reject</Button>
                  <Button size="sm" onClick={() => updateJob(j.id, { status: 'open' })}>Approve</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
