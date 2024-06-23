import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { LogoText } from '@/components/brand/logo-text';

type AuthLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: 'Login | CAHO'
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-full min-h-screen w-full p-8">
      <main className="mx-auto flex max-w-sm flex-1 flex-col justify-center gap-16">
        <LogoText />
        {children}
      </main>
    </div>
  );
}
