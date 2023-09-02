import { TooltipProvider } from '@/components/ui/tooltip';
import { clerkStyles } from '@/helpers/clerkStyles';
import '@/styles/globals.css';
import { cn } from '@/utils/cn';
import { ptBR } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { type Metadata } from 'next';
// eslint-disable-next-line camelcase
import { JetBrains_Mono, Roboto } from 'next/font/google';
import { type PropsWithChildren } from 'react';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Cartas contra a humanidade online!',
  description: 'O jogo para pessoas horríveis.'
};

const fontSans = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  style: 'normal',
  variable: '--font-sans'
});

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
          'font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ClerkProvider
          localization={ptBR}
          appearance={{ elements: clerkStyles }}
        >
          <TooltipProvider>
            <Providers>{children}</Providers>
          </TooltipProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
