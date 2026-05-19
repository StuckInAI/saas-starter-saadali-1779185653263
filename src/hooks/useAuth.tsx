import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { storage } from '@/lib/storage';
import { uid } from '@/lib/id';
import type { User, UserRole } from '@/types';

type AuthContextValue = {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  signup: (input: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
  }) => { ok: true; needsApproval: boolean } | { ok: false; error: string };
  logout: () => void;
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type StoredUser = User & { password: string };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>(() => storage.get<StoredUser[]>('users', []));
  const [currentId, setCurrentId] = useState<string | null>(() => storage.get<string | null>('currentUserId', null));

  useEffect(() => {
    storage.set('users', users);
  }, [users]);

  useEffect(() => {
    storage.set('currentUserId', currentId);
  }, [currentId]);

  const user = useMemo(() => {
    if (!currentId) return null;
    const found = users.find((u) => u.id === currentId);
    if (!found) return null;
    const { password: _pw, ...rest } = found;
    return rest as User;
  }, [currentId, users]);

  const login: AuthContextValue['login'] = (email, password) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { ok: false, error: 'No account found with that email.' };
    if (found.password !== password) return { ok: false, error: 'Incorrect password.' };
    if (found.role === 'hr' && !found.approved) {
      return { ok: false, error: 'Your HR account is pending approval.' };
    }
    setCurrentId(found.id);
    return { ok: true };
  };

  const signup: AuthContextValue['signup'] = ({ fullName, email, password, role }) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with that email already exists.' };
    }
    const newUser: StoredUser = {
      id: uid('user'),
      fullName,
      email,
      password,
      role,
      approved: role === 'public' ? true : users.filter((u) => u.role === 'hr' && u.approved).length === 0,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    if (newUser.approved) {
      setCurrentId(newUser.id);
    }
    return { ok: true, needsApproval: !newUser.approved };
  };

  const logout = () => setCurrentId(null);

  const approveUser = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, approved: true } : u)));
  };

  const rejectUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const publicUsers = useMemo(() => users.map(({ password: _pw, ...rest }) => rest as User), [users]);

  const value: AuthContextValue = {
    user,
    users: publicUsers,
    login,
    signup,
    logout,
    approveUser,
    rejectUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
