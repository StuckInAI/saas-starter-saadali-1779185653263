import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { newId } from '@/lib/id';
import type { AuthResult, PendingHrRequest, Role, SessionUser, User } from '@/types';

interface AuthContextValue {
  user: SessionUser | null;
  login: (email: string, password: string) => AuthResult;
  signup: (input: {
    fullName: string;
    email: string;
    password: string;
    role: Role;
  }) => AuthResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_KEY = 'hireflow:session';

function stripPassword(user: User): SessionUser {
  const { password: _pw, ...rest } = user;
  void _pw;
  return rest;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const stored = storage.get<SessionUser | null>(SESSION_KEY, null);
    if (stored) setUser(stored);
  }, []);

  const login = useCallback((email: string, password: string): AuthResult => {
    const users = storage.get<User[]>(STORAGE_KEYS.users, []);
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    const session = stripPassword(found);
    storage.set(SESSION_KEY, session);
    setUser(session);
    return { ok: true, user: session };
  }, []);

  const signup = useCallback(
    (input: { fullName: string; email: string; password: string; role: Role }): AuthResult => {
      const users = storage.get<User[]>(STORAGE_KEYS.users, []);
      const pending = storage.get<PendingHrRequest[]>(STORAGE_KEYS.pendingHr, []);

      const emailLower = input.email.toLowerCase();
      if (users.some((u) => u.email.toLowerCase() === emailLower)) {
        return { ok: false, error: 'An account with this email already exists.' };
      }
      if (pending.some((p) => p.email.toLowerCase() === emailLower && p.status === 'pending')) {
        return { ok: false, error: 'An HR access request for this email is already pending.' };
      }

      if (input.role === 'public') {
        const newUser: User = {
          id: newId(),
          fullName: input.fullName,
          email: input.email,
          password: input.password,
          role: 'public',
          createdAt: new Date().toISOString(),
        };
        storage.set(STORAGE_KEYS.users, [...users, newUser]);
        const session = stripPassword(newUser);
        storage.set(SESSION_KEY, session);
        setUser(session);
        return { ok: true, user: session };
      }

      // HR signup → requires approval
      const request: PendingHrRequest = {
        id: newId(),
        fullName: input.fullName,
        email: input.email,
        password: input.password,
        status: 'pending',
        requestedAt: new Date().toISOString(),
      };
      storage.set(STORAGE_KEYS.pendingHr, [...pending, request]);

      // Synthetic session-only user so the UI can show "awaiting approval"
      const placeholder: SessionUser = {
        id: request.id,
        fullName: request.fullName,
        email: request.email,
        role: 'hr',
        createdAt: request.requestedAt,
      };
      return { ok: true, user: placeholder, needsApproval: true };
    },
    [],
  );

  const logout = useCallback(() => {
    storage.remove(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, signup, logout }),
    [user, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
