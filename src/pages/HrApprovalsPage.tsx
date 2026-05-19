import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

export default function HrApprovalsPage() {
  const { users, approveUser } = useAuth();
  const { jobs, updateJob } = useJobs();
  const [, setTick] = useState(0);

  const pending = jobs.filter((j) => j.status === 'pending_approval');
  const pendingHr = users.filter((u) => u.role === 'hr' && !u.approved);

  const handleApproveUser = (id: string) => {
    approveUser(id);
    setTick((t) => t + 1);
  };

  const handleApproveJob = (id: string) => {
    updateJob(id, { status: 'open' });
  };

  const handleRejectJob = (id: string) => {
    updateJob(id, { status: 'closed' });
  };

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-5)' }}>Approvals</h1>

      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 16, marginBottom: 'var(--space-3)' }}>Pending HR accounts</h2>
        {pendingHr.length === 0 ? (
          <EmptyState title="No HR accounts awaiting approval" />
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {pendingHr.map((u) => (
              <Card key={u.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div>
                    <strong>{u.fullName}</strong>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{u.email}</div>
                  </div>
                  <Button onClick={() => handleApproveUser(u.id)}>Approve</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 16, marginBottom: 'var(--space-3)' }}>Pending job posts</h2>
        {pending.length === 0 ? (
          <EmptyState title="No job posts awaiting approval" />
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {pending.map((j) => (
              <Card key={j.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div>
                    <strong>{j.title}</strong>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                      {j.department} · {j.location}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Button variant="secondary" onClick={() => handleRejectJob(j.id)}>Reject</Button>
                    <Button onClick={() => handleApproveJob(j.id)}>Approve</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
