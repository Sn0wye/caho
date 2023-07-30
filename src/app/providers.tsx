'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { api } from '@/utils/api';

interface ProvidersProps {
  children: ReactNode;
}

export const ProvidersComponent = ({ children }: ProvidersProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <>{children}</>;

  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      {children}
      <Toaster />
    </ThemeProvider>
  );
};

export const Providers = api.withTRPC(
  ProvidersComponent
) as React.ComponentType<React.PropsWithChildren>;
