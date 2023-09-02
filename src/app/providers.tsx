'use client';

import { Toaster } from '@/components/ui/toaster';
import { api } from '@/utils/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState, type ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export const ProvidersComponent = ({ children }: ProvidersProps) => {
  // const [isMounted, setIsMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // if (!isMounted) return <>{children}</>;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export const Providers = api.withTRPC(
  ProvidersComponent
) as React.ComponentType<React.PropsWithChildren>;
