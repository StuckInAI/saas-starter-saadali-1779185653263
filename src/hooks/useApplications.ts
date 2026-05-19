import { useCallback, useEffect, useState } from 'react';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { uid } from '@/lib/id';
import type { Application, ApplicationStatus } from '@/types';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(() =>
    storage.get<Application[]>(STORAGE_KEYS.applications, [])
  );

  const persist = useCallback((next: Application[]) => {
    storage.set<Application[]>(STORAGE_KEYS.applications, next);
    setApplications(next);
  }, []);

  useEffect(() => {
    setApplications(storage.get<Application[]>(STORAGE_KEYS.applications, []));
  }, []);

  const createApplication = useCallback(
    (data: Omit<Application, 'id' | 'status' | 'appliedAt'>): Application => {
      const app: Application = {
        ...data,
        id: uid('app'),
        status: 'submitted',
        appliedAt: new Date().toISOString(),
      };
      const current = storage.get<Application[]>(STORAGE_KEYS.applications, []);
      const next = [app, ...current];
      persist(next);
      return app;
    },
    [persist]
  );

  const updateStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      const current = storage.get<Application[]>(STORAGE_KEYS.applications, []);
      const next = current.map((a) => (a.id === id ? { ...a, status } : a));
      persist(next);
    },
    [persist]
  );

  const updateApplication = useCallback(
    (id: string, patch: Partial<Application>) => {
      const current = storage.get<Application[]>(STORAGE_KEYS.applications, []);
      const next = current.map((a) => (a.id === id ? { ...a, ...patch } : a));
      persist(next);
    },
    [persist]
  );

  return { applications, createApplication, updateStatus, updateApplication };
}
