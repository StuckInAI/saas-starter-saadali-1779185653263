import { storage } from '@/lib/storage';
import type { Job, User } from '@/types';

const SEED_FLAG = 'hireflow.seeded.v1';

export function seedIfEmpty(): void {
  if (localStorage.getItem(SEED_FLAG)) return;

  const now = new Date().toISOString();
  const adminId = 'u_admin_seed';
  const hrId = 'u_hr_seed';

  const users: User[] = [
    {
      id: adminId,
      email: 'admin@hireflow.app',
      password: 'admin123',
      fullName: 'System Admin',
      role: 'hr',
      hrStatus: 'approved',
      createdAt: now,
    },
    {
      id: hrId,
      email: 'sara.hr@hireflow.app',
      password: 'password',
      fullName: 'Sara Mitchell',
      role: 'hr',
      hrStatus: 'approved',
      createdAt: now,
    },
  ];

  const jobs: Job[] = [
    {
      id: 'j_seed_1',
      title: 'Senior Frontend Engineer',
      department: 'Engineering',
      location: 'Remote',
      employmentType: 'Full-time',
      salaryMin: 110000,
      salaryMax: 150000,
      description:
        'Build delightful user interfaces for our hiring platform. Collaborate with designers and backend engineers to ship features end-to-end.',
      requirements:
        '5+ years of React experience. Strong TypeScript skills. Experience with design systems and accessibility.',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
      postedById: hrId,
      postedAt: now,
      status: 'open',
    },
    {
      id: 'j_seed_2',
      title: 'People Operations Specialist',
      department: 'Human Resources',
      location: 'New York, NY',
      employmentType: 'Full-time',
      salaryMin: 65000,
      salaryMax: 85000,
      description:
        'Support our growing team with onboarding, employee engagement, and HR program execution.',
      requirements:
        '2+ years in HR or People Ops. Excellent communication. HRIS familiarity preferred.',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString().slice(0, 10),
      postedById: hrId,
      postedAt: now,
      status: 'open',
    },
  ];

  storage.setUsers(users);
  storage.setJobs(jobs);
  storage.setApplications([]);
  localStorage.setItem(SEED_FLAG, '1');
}
