import { useCallback, useEffect, useState } from 'react';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { uid } from '@/lib/id';
import type { Job } from '@/types';

export function useJobs() {
  const [jobs, setJobsState] = useState<Job[]>(() => storage.get<Job[]>(STORAGE_KEYS.jobs, []));

  const persist = useCallback((next: Job[]) => {
    storage.set<Job[]>(STORAGE_KEYS.jobs, next);
    setJobsState(next);
  }, []);

  const refresh = useCallback(() => {
    setJobsState(storage.get<Job[]>(STORAGE_KEYS.jobs, []));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createJob = useCallback(
    (data: Omit<Job, 'id' | 'status' | 'postedAt'> & { status?: Job['status'] }): Job => {
      const job: Job = {
        ...data,
        id: uid('job'),
        status: data.status ?? 'open',
        postedAt: new Date().toISOString(),
      };
      const current = storage.get<Job[]>(STORAGE_KEYS.jobs, []);
      const next = [job, ...current];
      persist(next);
      return job;
    },
    [persist]
  );

  const updateJob = useCallback(
    (id: string, patch: Partial<Job>) => {
      const current = storage.get<Job[]>(STORAGE_KEYS.jobs, []);
      const next = current.map((j) => (j.id === id ? { ...j, ...patch } : j));
      persist(next);
    },
    [persist]
  );

  const deleteJob = useCallback(
    (id: string) => {
      const current = storage.get<Job[]>(STORAGE_KEYS.jobs, []);
      persist(current.filter((j) => j.id !== id));
    },
    [persist]
  );

  return { jobs, createJob, updateJob, deleteJob, refresh };
}
