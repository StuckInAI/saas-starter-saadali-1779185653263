import { useCallback, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { uid } from '@/lib/id';
import type { Job } from '@/types';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(() => storage.getJobs());

  useEffect(() => {
    storage.setJobs(jobs);
  }, [jobs]);

  const refresh = useCallback(() => {
    setJobs(storage.getJobs());
  }, []);

  const createJob = useCallback((data: Omit<Job, 'id' | 'postedAt' | 'status'>): Job => {
    const job: Job = {
      ...data,
      id: uid('j'),
      postedAt: new Date().toISOString(),
      status: 'open',
    };
    setJobs((prev) => [job, ...prev]);
    return job;
  }, []);

  const updateJob = useCallback((id: string, patch: Partial<Job>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, []);

  return { jobs, createJob, updateJob, deleteJob, refresh };
}
