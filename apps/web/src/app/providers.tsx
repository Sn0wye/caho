'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
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
