import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { storage } from '@/lib/storage';
import { uid } from '@/lib/id';
import type { User } from '@/types';

type StoredUser = User & { password: string; approved: boolean };

export type AuthResult =
  | { ok: true; user: User; needsApproval?: boolean }
  | { ok: false; error: string; needsApproval?: boolean };

type AuthContextValue = {
  user: User | null;
  users: StoredUser[];
  login: (email: string, password: string) => AuthResult;
  signup: (input: {
    fullName: string;
    email: string;
    password: string;
    role: 'hr' | 'public';
  }) => AuthResult;
  logout: () => void;
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;
  refreshUsers: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = 'hireflow.users';
const SESSION_KEY = 'hireflow.session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>(() => storage.get<StoredUser[]>(USERS_KEY, []));
  const [user, setUser] = useState<User | null>(() => storage.get<User | null>(SESSION_KEY, null));

  useEffect(() => {
    storage.set(USERS_KEY, users);
  }, [users]);

  useEffect(() => {
    storage.set(SESSION_KEY, user);
  }, [user]);

  const refreshUsers = useCallback(() => {
    setUsers(storage.get<StoredUser[]>(USERS_KEY, []));
  }, []);

  const login = useCallback(
    (email: string, password: string): AuthResult => {
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found) return { ok: false, error: 'No account found with that email.' };
      if (found.password !== password) return { ok: false, error: 'Incorrect password.' };
      if (found.role === 'hr' && !found.approved) {
        return { ok: false, error: 'Your HR account is pending approval.', needsApproval: true };
      }
      const session: User = {
        id: found.id,
        fullName: found.fullName,
        email: found.email,
        role: found.role,
        createdAt: found.createdAt,
      };
      setUser(session);
      return { ok: true, user: session };
    },
    [users]
  );

  const signup = useCallback(
    (input: { fullName: string; email: string; password: string; role: 'hr' | 'public' }): AuthResult => {
      const exists = users.some((u) => u.email.toLowerCase() === input.email.toLowerCase());
      if (exists) return { ok: false, error: 'An account with that email already exists.' };

      const newUser: StoredUser = {
        id: uid(),
        fullName: input.fullName,
        email: input.email,
        role: input.role,
        password: input.password,
        approved: input.role === 'public' ? true : false,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);

      if (newUser.role === 'public') {
        const session: User = {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        };
        setUser(session);
        return { ok: true, user: session };
      }

      return {
        ok: true,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
        needsApproval: true,
      };
    },
    [users]
  );

  const logout = useCallback(() => setUser(null), []);

  const approveUser = useCallback((id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, approved: true } : u)));
  }, []);

  const rejectUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, users, login, signup, logout, approveUser, rejectUser, refreshUsers }),
    [user, users, login, signup, logout, approveUser, rejectUser, refreshUsers]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
