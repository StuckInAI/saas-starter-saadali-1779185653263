import { useCallback, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { uid } from '@/lib/id';
import type { Application, ApplicationStatus } from '@/types';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(() => storage.getApplications());

  useEffect(() => {
    storage.setApplications(applications);
  }, [applications]);

  const createApplication = useCallback((data: Omit<Application, 'id' | 'appliedAt' | 'status'>): Application => {
    const app: Application = {
      ...data,
      id: uid('a'),
      appliedAt: new Date().toISOString(),
      status: 'new',
    };
    setApplications((prev) => [app, ...prev]);
    return app;
  }, []);

  const updateStatus = useCallback((id: string, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  return { applications, createApplication, updateStatus };
}
