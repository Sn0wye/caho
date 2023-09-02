import { type ReactNode } from 'react';
import { Search } from 'lucide-react';
import {
  DashboardBreadcrumbs,
  type BreadcrumbType
} from '@/components/dashboard/dashboard-breadcrumbs';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';

const breadcrumbs: BreadcrumbType[] = [
  {
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    label: 'Partidas públicas',
    href: '/dashboard/list-public-rooms'
  }
];

interface ListPublicRoomsLayoutProps {
  children: ReactNode;
}

export default function ListPublicRoomsLayout({
  children
}: ListPublicRoomsLayoutProps) {
  return (
    <section className="flex w-full max-w-5xl flex-col gap-16">
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
