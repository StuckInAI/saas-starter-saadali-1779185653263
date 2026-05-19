import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import EmptyState from '@/components/ui/EmptyState';
import { useJobs } from '@/hooks/useJobs';
import styles from './JobsPage.module.css';

export default function JobsPage() {
  const { jobs } = useJobs();
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState<string>('all');
  const [type, setType] = useState<string>('all');

  const departments = useMemo(() => Array.from(new Set(jobs.map((j) => j.department))).sort(), [jobs]);
  const types = useMemo(() => Array.from(new Set(jobs.map((j) => j.employmentType))).sort(), [jobs]);

  const visible = useMemo(() => {
    return jobs
      .filter((j) => j.status === 'open')
      .filter((j) => (dept === 'all' ? true : j.department === dept))
      .filter((j) => (type === 'all' ? true : j.employmentType === type))
      .filter((j) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q)
        );
      });
  }, [jobs, query, dept, type]);

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div>
          <h1>Open positions</h1>
          <p>{visible.length} role{visible.length === 1 ? '' : 's'} matching your filters</p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by title, location, or keyword"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            className={styles.search}
          />
        </div>
        <select value={dept} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDept(e.target.value)} className={styles.filter}>
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select value={type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value)} className={styles.filter}>
          <option value="all">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No open jobs match your filters" description="Try clearing your search or check back soon." />
      ) : (
        <div className={styles.grid}>
          {visible.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
