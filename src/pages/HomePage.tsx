import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users } from 'lucide-react';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { Application, Job } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import styles from './HomePage.module.css';

export default function HomePage() {
  const jobs = storage.get<Job[]>(STORAGE_KEYS.jobs, []).filter((j) => j.status === 'open');
  const applications = storage.get<Application[]>(STORAGE_KEYS.applications, []);
  const featured = jobs.slice(0, 3);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>HireFlow · Modern hiring</span>
          <h1 className={styles.title}>Find your next role. Hire your next teammate.</h1>
          <p className={styles.subtitle}>
            A streamlined platform connecting great people with great companies. Browse open roles, apply in minutes,
            and let HR teams move candidates forward with clarity.
          </p>
          <div className={styles.actions}>
            <Link to="/jobs" className={styles.primaryCta}>
              Browse open roles
              <ArrowRight size={16} />
            </Link>
            <Link to="/signup" className={styles.secondaryCta}>
              Create an account
            </Link>
          </div>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <Briefcase size={18} />
            <div>
              <strong>{jobs.length}</strong>
              <span>Open roles</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Users size={18} />
            <div>
              <strong>{applications.length}</strong>
              <span>Applications submitted</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2>Featured openings</h2>
          <Link to="/jobs" className={styles.viewAll}>
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className={styles.empty}>No open roles right now — check back soon.</p>
        ) : (
          <div className={styles.grid}>
            {featured.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      <section className={styles.valueProps}>
        <h2>Why teams choose HireFlow</h2>
        <div className={styles.valueGrid}>
          <div className={styles.valueCard}>
            <h3>Fast to post</h3>
            <p>Spin up a role in minutes with structured fields HR teams actually need.</p>
          </div>
          <div className={styles.valueCard}>
            <h3>Clear pipelines</h3>
            <p>Track every applicant from submission to offer without spreadsheets.</p>
          </div>
          <div className={styles.valueCard}>
            <h3>Approval workflows</h3>
            <p>Built-in approvals keep new HR users and job posts compliant.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
