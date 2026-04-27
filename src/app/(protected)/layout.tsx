import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getUser } from '@/auth/server';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({
  children
}: ProtectedLayoutProps) {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return children;
}
