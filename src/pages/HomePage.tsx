import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Briefcase, ShieldCheck, Users } from 'lucide-react';
import { storage } from '@/lib/storage';
import styles from './HomePage.module.css';

export default function HomePage() {
  const jobs = storage.getJobs().filter((j) => j.status === 'open');
  const applications = storage.getApplications();

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Hiring management, simplified</span>
          <h1 className={styles.title}>Find your next great hire — or your next great role.</h1>
          <p className={styles.lede}>
            HireFlow gives HR teams a streamlined way to post roles, review applicants, and move
            candidates through the pipeline. Job seekers can apply in minutes, no account required.
          </p>
          <div className={styles.ctas}>
            <Link to="/jobs" className={styles.primaryCta}>
              Browse open roles <ArrowRight size={16} />
            </Link>
            <Link to="/signup" className={styles.secondaryCta}>Create an account</Link>
          </div>
          <div className={styles.stats}>
            <div>
              <strong>{jobs.length}</strong>
              <span>Open roles</span>
            </div>
            <div>
              <strong>{applications.length}</strong>
              <span>Applications received</span>
            </div>
            <div>
              <strong>5</strong>
              <span>Pipeline stages</span>
            </div>
          </div>
        </div>
        <div className={styles.heroArt}>
          <div className={styles.artCard} style={{ top: 0, left: 0 }}>
            <Briefcase size={20} />
            <div>
              <strong>Senior Frontend Engineer</strong>
              <span>Engineering · Remote</span>
            </div>
          </div>
          <div className={styles.artCard} style={{ top: 90, left: 80 }}>
            <Users size={20} />
            <div>
              <strong>12 new applicants</strong>
              <span>This week</span>
            </div>
          </div>
          <div className={styles.artCard} style={{ top: 200, left: 20 }}>
            <BarChart3 size={20} />
            <div>
              <strong>Pipeline health</strong>
              <span>3 interviews scheduled</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <FeatureCard
          icon={<Briefcase size={20} />}
          title="Post & manage jobs"
          description="HR teams can create rich job listings with department, location, salary, and deadlines."
        />
        <FeatureCard
          icon={<Users size={20} />}
          title="Guest applications"
          description="Applicants apply with just an email and resume — no friction, more pipeline."
        />
        <FeatureCard
          icon={<BarChart3 size={20} />}
          title="Pipeline tracking"
          description="Move candidates through New → Reviewing → Interviewed → Hired or Rejected."
        />
        <FeatureCard
          icon={<ShieldCheck size={20} />}
          title="Admin approval"
          description="HR self-signup is gated by admin approval to keep your team trusted."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
