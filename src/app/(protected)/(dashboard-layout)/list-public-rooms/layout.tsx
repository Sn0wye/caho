import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { DashboardPageHeader } from '../_components/dashboard-page-header';

interface ListPublicRoomsLayoutProps {
  children: ReactNode;
}

export default function ListPublicRoomsLayout({
  children
}: ListPublicRoomsLayoutProps) {
  return (
    <section className="flex w-full max-w-5xl flex-col gap-16">
      <DashboardPageHeader
        title="Encontrar uma partida pública"
        subtitle="Acredite se quiser, algumas pessoas tem coragem de deixar uma sala pública... Tente a sorte lá!"
        icon={<Search size={24} />}
      />

      {children}
    </section>
  );
}
