import { Link } from 'react-router-dom';
import { Building2, Clock, MapPin, Wallet } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatCurrency, timeAgo } from '@/lib/format';
import type { Job } from '@/types';
import styles from './JobCard.module.css';

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link to={`/jobs/${job.id}`} className={styles.card}>
      <div className={styles.headerRow}>
        <div>
          <h3 className={styles.title}>{job.title}</h3>
          <p className={styles.dept}>
            <Building2 size={13} />
            <span>{job.department}</span>
          </p>
        </div>
        <Badge tone={job.status === 'open' ? 'success' : 'neutral'}>{job.status}</Badge>
      </div>

      <div className={styles.meta}>
        <span className={styles.metaItem}><MapPin size={13} />{job.location}</span>
        <span className={styles.metaItem}><Wallet size={13} />{formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)}</span>
        <span className={styles.metaItem}><Clock size={13} />{job.employmentType}</span>
      </div>

      <p className={styles.desc}>{job.description}</p>

      <div className={styles.footer}>
        <span className={styles.posted}>Posted {timeAgo(job.postedAt)}</span>
        <span className={styles.cta}>View details →</span>
      </div>
    </Link>
  );
}
