import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { uid } from '@/lib/id';
import type { AuthResult, Role, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => AuthResult;
  signup: (data: { fullName: string; email: string; password: string; role: Role }) => AuthResult & { needsApproval?: boolean };
  logout: () => void;
  approveUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => storage.get<User[]>(STORAGE_KEYS.users, []));
  const [user, setUser] = useState<User | null>(() => storage.get<User | null>(STORAGE_KEYS.session, null));

  useEffect(() => {
    setUsers(storage.get<User[]>(STORAGE_KEYS.users, []));
  }, []);

  const persistUsers = useCallback((next: User[]) => {
    storage.set<User[]>(STORAGE_KEYS.users, next);
    setUsers(next);
  }, []);

  const persistSession = useCallback((next: User | null) => {
    if (next) {
      storage.set<User>(STORAGE_KEYS.session, next);
    } else {
      storage.remove(STORAGE_KEYS.session);
    }
    setUser(next);
  }, []);

  const login = useCallback(
    (email: string, password: string): AuthResult => {
      const list = storage.get<User[]>(STORAGE_KEYS.users, []);
      const found = list.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found) return { ok: false, error: 'No account found with that email.' };
      if (found.password !== password) return { ok: false, error: 'Incorrect password.' };
      if (found.role === 'hr' && !found.approved) {
        return { ok: false, error: 'Your HR account is pending approval.' };
      }
      persistSession(found);
      return { ok: true };
    },
    [persistSession]
  );

  const signup = useCallback(
    ({ fullName, email, password, role }: { fullName: string; email: string; password: string; role: Role }) => {
      const list = storage.get<User[]>(STORAGE_KEYS.users, []);
      if (list.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false as const, error: 'An account with that email already exists.' };
      }
      const needsApproval = role === 'hr';
      const newUser: User = {
        id: uid('user'),
        fullName,
        email,
        password,
        role,
        approved: !needsApproval,
        createdAt: new Date().toISOString(),
      };
      const next = [...list, newUser];
      persistUsers(next);
      if (!needsApproval) {
        persistSession(newUser);
      }
      return { ok: true as const, needsApproval };
    },
    [persistSession, persistUsers]
  );

  const logout = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  const approveUser = useCallback(
    (id: string) => {
      const list = storage.get<User[]>(STORAGE_KEYS.users, []);
      const next = list.map((u) => (u.id === id ? { ...u, approved: true } : u));
      persistUsers(next);
    },
    [persistUsers]
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, users, login, signup, logout, approveUser }),
    [user, users, login, signup, logout, approveUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
