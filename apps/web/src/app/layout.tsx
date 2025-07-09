import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthServerProvider } from '@/auth/server';
import '@/styles/globals.css';
import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { cn } from '@/utils/cn';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Cartas contra a humanidade online!',
  description: 'O jogo para pessoas horríveis.'
};

const fontSans = GeistSans;
const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  style: 'normal',
  variable: '--font-mono'
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <AuthServerProvider>
          <TooltipProvider>
            <Providers>{children}</Providers>
          </TooltipProvider>
        </AuthServerProvider>
      </body>
    </html>
  );
}
