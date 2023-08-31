import { DashboardBreadcrumbs } from '@/components/dashboard/dashboard-breadcrumbs';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { Search } from 'lucide-react';
import { type ReactNode } from 'react';

interface ListPublicRoomsLayoutProps {
  children: ReactNode;
}

export default function ListPublicRoomsLayout({
  children
}: ListPublicRoomsLayoutProps) {
  return (
    <section className="flex flex-col gap-16 w-full max-w-5xl">
      <div className="flex flex-col gap-6">
        <DashboardBreadcrumbs />

        <DashboardPageHeader
          title="Encontrar uma partida pública"
          subtitle="Acredite se quiser, algumas pessoas tem coragem de deixar uma sala pública... Tente a sorte lá!"
          icon={<Search size={24} />}
        />
      </div>

      {children}
    </section>
  );
}
