import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useJobs } from '@/hooks/useJobs';
import { timeAgo, formatCurrency } from '@/lib/format';

export default function HrApprovalsPage() {
  const { jobs, updateJob } = useJobs();

  const pending = jobs.filter((j) => j.status === 'pending');

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 6 }}>Pending Approvals</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>
        Review and approve job postings submitted by HR teammates.
      </p>

      {pending.length === 0 ? (
        <EmptyState
          title="All caught up"
          description="There are no job postings waiting for approval right now."
        />
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {pending.map((job) => (
            <Card key={job.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <Link to={`/jobs/${job.id}`} style={{ fontSize: 16, fontWeight: 600 }}>
                    {job.title}
                  </Link>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
                    {job.department} · {job.location} · {formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>
                    Submitted {timeAgo(job.postedAt)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" onClick={() => updateJob(job.id, { status: 'open' })}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => updateJob(job.id, { status: 'closed' })}>Reject</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
