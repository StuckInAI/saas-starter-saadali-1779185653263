import { storage, STORAGE_KEYS } from '@/lib/storage';
import { uid } from '@/lib/id';
import type { Application, Job, StoredUser } from '@/types';

export function seedIfEmpty() {
  const existingUsers = storage.get<StoredUser[]>(STORAGE_KEYS.users, []);
  const existingJobs = storage.get<Job[]>(STORAGE_KEYS.jobs, []);
  const existingApps = storage.get<Application[]>(STORAGE_KEYS.applications, []);

  if (existingUsers.length > 0 || existingJobs.length > 0 || existingApps.length > 0) {
    return;
  }

  const hrId = uid('user');
  const applicantId = uid('user');

  const users: StoredUser[] = [
    {
      id: hrId,
      fullName: 'Alex HR',
      email: 'hr@hireflow.test',
      password: 'password',
      role: 'hr',
      approved: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: applicantId,
      fullName: 'Jamie Applicant',
      email: 'applicant@hireflow.test',
      password: 'password',
      role: 'public',
      approved: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const jobs: Job[] = [
    {
      id: uid('job'),
      title: 'Senior Frontend Engineer',
      department: 'Engineering',
      location: 'Remote',
      description:
        'Build delightful, accessible user interfaces for our hiring platform using React and TypeScript.',
      employmentType: 'Full-time',
      salaryMin: 120000,
      salaryMax: 160000,
      responsibilities: [
        'Design and implement new product features',
        'Collaborate with designers and backend engineers',
        'Mentor junior engineers and review code',
      ],
      requirements: ['5+ years React', 'Strong TypeScript', 'CSS fundamentals'],
      postedBy: hrId,
      postedAt: new Date().toISOString(),
      status: 'open',
    },
    {
      id: uid('job'),
      title: 'Product Designer',
      department: 'Design',
      location: 'New York, NY',
      description: 'Shape the end-to-end experience of HireFlow across web and mobile.',
      employmentType: 'Full-time',
      salaryMin: 95000,
      salaryMax: 130000,
      responsibilities: [
        'Own product flows from research to delivery',
        'Run usability sessions with HR teams',
        'Maintain our design system',
      ],
      requirements: ['Portfolio with shipped work', 'Figma proficiency', 'Systems thinking'],
      postedBy: hrId,
      postedAt: new Date().toISOString(),
      status: 'open',
    },
  ];

  storage.set<StoredUser[]>(STORAGE_KEYS.users, users);
  storage.set<Job[]>(STORAGE_KEYS.jobs, jobs);
  storage.set<Application[]>(STORAGE_KEYS.applications, []);
}
