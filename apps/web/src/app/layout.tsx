import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { clerkStyles } from '@/helpers/clerkStyles';
import '@/styles/globals.css';
import '@/styles/themes/blue.css';
import '@/styles/themes/dracula.css';
import '@/styles/themes/green.css';
import '@/styles/themes/nord.css';
import '@/styles/themes/ocean.css';
import '@/styles/themes/orange.css';
import '@/styles/themes/red.css';
import '@/styles/themes/rose.css';
import '@/styles/themes/violet.css';
import '@/styles/themes/yellow.css';
import '@/styles/themes/zinc.css';


import { cn } from '@/utils/cn';
import { ptBR } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { availableThemes } from 'config/theme';
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
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          themes={availableThemes}
          attribute="class"
          defaultTheme="light-zinc"
          disableTransitionOnChange
          enableSystem={false}
        >
          <ClerkProvider
            localization={ptBR}
            appearance={{ elements: clerkStyles }}
          >
            <TooltipProvider>
              <Providers>
                {children}
              </Providers>
              <Toaster />
            </TooltipProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
