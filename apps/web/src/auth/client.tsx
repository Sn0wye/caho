'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { type User } from '@caho/schemas';

type Props = {
  children?: ReactNode;
  user: User | null;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
};

const AuthContext = createContext({} as AuthContextType);

export function AuthClientProvider(props: Props) {
  const [user] = useState(props.user);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
      {props.children}
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
