import { DashboardBreadcrumbs, type BreadcrumbType } from '@/components/dashboard/dashboard-breadcrumbs';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { Search } from 'lucide-react';
import { type ReactNode } from 'react';

const breadcrumbs: BreadcrumbType[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Partidas públicas',
    href: '/dashboard/list-public-rooms',
  }
];

interface ListPublicRoomsLayoutProps {
  children: ReactNode;
}

export default function ListPublicRoomsLayout({
  children
}: ListPublicRoomsLayoutProps) {
  return (
    <section className="flex flex-col gap-16 w-full max-w-5xl">
      <div className="flex flex-col gap-6">
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />

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
