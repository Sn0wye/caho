import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { DashboardPageHeader } from '../_components/dashboard-page-header';

interface RoomsLayoutProps {
  children: ReactNode;
}

export default function RoomsLayout({ children }: RoomsLayoutProps) {
  return (
    <section className="flex w-full max-w-5xl flex-col gap-16">
      <DashboardPageHeader
        title="Encontrar uma partida"
        subtitle="Todas as salas esperando jogadores. As com cadeado pedem senha."
        icon={<Search size={24} />}
      />

      {children}
    </section>
  );
}
