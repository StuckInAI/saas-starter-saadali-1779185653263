import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { storage } from '@/lib/storage';
import { uid } from '@/lib/id';
import type { User, UserRole } from '@/types';

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  signup: (params: { fullName: string; email: string; password: string; role: UserRole }) => { ok: true; needsApproval: boolean } | { ok: false; error: string };
  logout: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => storage.getSession());
  const [tick, setTick] = useState(0);

  const user = useMemo<User | null>(() => {
    if (!userId) return null;
    const users = storage.getUsers();
    return users.find((u) => u.id === userId) || null;
  }, [userId, tick]);

  useEffect(() => {
    storage.setSession(userId);
  }, [userId]);

  const login: AuthContextValue['login'] = useCallback((email, password) => {
    const users = storage.getUsers();
    const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!match) return { ok: false, error: 'Invalid email or password.' };
    if (match.role === 'hr' && match.hrStatus !== 'approved') {
      if (match.hrStatus === 'pending') return { ok: false, error: 'Your HR account is pending admin approval.' };
      if (match.hrStatus === 'rejected') return { ok: false, error: 'Your HR account application was rejected.' };
    }
    setUserId(match.id);
    return { ok: true };
  }, []);

  const signup: AuthContextValue['signup'] = useCallback(({ fullName, email, password, role }) => {
    const users = storage.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with that email already exists.' };
    }
    const newUser: User = {
      id: uid('u'),
      email,
      password,
      fullName,
      role,
      hrStatus: role === 'hr' ? 'pending' : undefined,
      createdAt: new Date().toISOString(),
    };
    storage.setUsers([...users, newUser]);
    if (role === 'public') {
      setUserId(newUser.id);
      return { ok: true, needsApproval: false };
    }
    return { ok: true, needsApproval: true };
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
  }, []);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const value = useMemo<AuthContextValue>(() => ({ user, login, signup, logout, refresh }), [user, login, signup, logout, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
