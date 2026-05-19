import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useJobs } from '@/hooks/useJobs';
import { formatCurrency, timeAgo } from '@/lib/format';

export default function HrApprovalsPage() {
  const { jobs, updateJob } = useJobs();

  const pending = jobs.filter((j) => j.approvalStatus === 'pending');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Job Approvals</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Review pending job postings before they go live.</p>
      </div>

      {pending.length === 0 ? (
        <EmptyState title="No pending approvals" description="All caught up! Newly submitted jobs will appear here." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pending.map((job) => (
            <Card key={job.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600 }}>{job.title}</h3>
                    <Badge tone="warning">pending</Badge>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {job.department} · {job.location} · {formatCurrency(job.salaryMin)}–{formatCurrency(job.salaryMax)}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                    Submitted by {job.postedByName} · {timeAgo(job.postedAt)}
                  </p>
                  <p style={{ fontSize: 13, marginTop: 8 }}>{job.description}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Button size="sm" onClick={() => updateJob(job.id, { approvalStatus: 'approved', status: 'open' })}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => updateJob(job.id, { approvalStatus: 'rejected', status: 'closed' })}>Reject</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
