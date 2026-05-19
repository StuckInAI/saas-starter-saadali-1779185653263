import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { useJobs } from '@/hooks/useJobs';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/format';
import type { ApplicationStatus } from '@/types';

const statusTone: Record<ApplicationStatus, 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  submitted: 'info',
  reviewing: 'primary',
  interview: 'warning',
  offer: 'success',
  rejected: 'danger',
};

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const { applications } = useApplications();
  const { jobs } = useJobs();

  const mine = useMemo(() => {
    if (!user) return [];
    return applications
      .filter((a) => a.applicantId === user.id)
      .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
  }, [applications, user]);

  const jobsById = useMemo(() => {
    const map = new Map(jobs.map((j) => [j.id, j] as const));
    return map;
  }, [jobs]);

  return (
    <div>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>My applications</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
          Track the roles you've applied for.
        </p>
      </header>

      {mine.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Browse open roles and submit your first application."
          action={
            <Link to="/jobs">
              <Button>Browse jobs</Button>
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {mine.map((app) => {
            const job = jobsById.get(app.jobId);
            return (
              <Card key={app.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 16, marginBottom: 4 }}>
                      {job ? job.title : 'Job no longer available'}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                      {job ? `${job.department} · ${job.location}` : '—'}
                    </p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 8 }}>
                      Applied {formatDate(app.appliedAt)}
                    </p>
                  </div>
                  <Badge tone={statusTone[app.status]}>{app.status}</Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
