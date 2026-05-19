import { storage } from './storage';
import { uid } from './id';
import type { Application, Job, User } from '@/types';

type StoredUser = User & { password: string };

export function seedIfEmpty() {
  const existingUsers = storage.get<StoredUser[]>('users', []);
  if (existingUsers.length > 0) return;

  const hrId = uid('user');
  const applicantId = uid('user');

  const users: StoredUser[] = [
    {
      id: hrId,
      fullName: 'Avery Chen',
      email: 'hr@hireflow.test',
      password: 'password',
      role: 'hr',
      approved: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: applicantId,
      fullName: 'Jordan Reyes',
      email: 'applicant@hireflow.test',
      password: 'password',
      role: 'public',
      approved: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const now = Date.now();
  const jobs: Job[] = [
    {
      id: uid('job'),
      title: 'Senior Frontend Engineer',
      department: 'Engineering',
      location: 'Remote · US',
      description:
        'Build delightful product experiences with React, TypeScript, and a strong design sensibility. Partner closely with designers and PMs to ship weekly.',
      employmentType: 'Full-time',
      salaryMin: 140000,
      salaryMax: 180000,
      requirements: ['5+ years building production React apps', 'Strong TypeScript fundamentals', 'Product-minded'],
      postedBy: hrId,
      postedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: 'open',
    },
    {
      id: uid('job'),
      title: 'People Operations Lead',
      department: 'People',
      location: 'New York, NY',
      description:
        'Own the employee lifecycle end-to-end, from onboarding to engagement. Help us scale a healthy, high-performing culture.',
      employmentType: 'Full-time',
      salaryMin: 110000,
      salaryMax: 140000,
      requirements: ['3+ years in People Ops', 'Excellent communication', 'Comfort with HRIS tools'],
      postedBy: hrId,
      postedAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
      status: 'open',
    },
  ];

  const applications: Application[] = [];

  storage.set('users', users);
  storage.set('jobs', jobs);
  storage.set('applications', applications);
}
