'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { User } from '@/schemas';

type Props = {
  children?: ReactNode;
  user: User | null;
  sessionCookie: string | null;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  sessionCookie: string | null;
};

const AuthContext = createContext({} as AuthContextType);

// Read straight from props (not useState) so router.refresh() after a profile
// update reaches every consumer.
export function AuthClientProvider({ user, sessionCookie, children }: Props) {
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, sessionCookie }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx;
}

export function useUser() {
  const { user } = useAuth();
  return { user };
}
