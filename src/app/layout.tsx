import '@/styles/globals.css';
import { type PropsWithChildren } from 'react';
import { type Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Cartas contra a humanidade online!',
  description: 'O jogo para pessoas horríveis.'
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      {/* TODO: Add font to body */}
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
