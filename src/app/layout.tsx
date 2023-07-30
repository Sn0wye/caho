import '@/styles/globals.css';
import { type PropsWithChildren } from 'react';
import { type Metadata } from 'next';
// eslint-disable-next-line camelcase
import { JetBrains_Mono, Roboto } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { cn } from '@/utils/cn';
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
      <body className={cn('font-sans', fontSans.variable, fontMono.variable)}>
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
