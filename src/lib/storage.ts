import type { Application, Job, User } from '@/types';

const KEYS = {
  users: 'hireflow.users',
  jobs: 'hireflow.jobs',
  applications: 'hireflow.applications',
  session: 'hireflow.session',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUsers: (): User[] => read<User[]>(KEYS.users, []),
  setUsers: (users: User[]): void => write(KEYS.users, users),
  getJobs: (): Job[] => read<Job[]>(KEYS.jobs, []),
  setJobs: (jobs: Job[]): void => write(KEYS.jobs, jobs),
  getApplications: (): Application[] => read<Application[]>(KEYS.applications, []),
  setApplications: (apps: Application[]): void => write(KEYS.applications, apps),
  getSession: (): string | null => localStorage.getItem(KEYS.session),
  setSession: (value: string | null): void => {
    if (value === null) localStorage.removeItem(KEYS.session);
    else localStorage.setItem(KEYS.session, value);
  },
};

export const STORAGE_KEYS = KEYS;
