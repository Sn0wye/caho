import {
  DashboardBreadcrumbs,
  type BreadcrumbType
} from '@/components/dashboard/dashboard-breadcrumbs';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { Server } from 'lucide-react';

const breadcrumbs: BreadcrumbType[] = [
  {
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    label: 'Configurações',
    href: '/dashboard/settings'
  },
  {
    label: 'Dispositivos',
    href: '/dashboard/settings/connections'
  }
];

export default function ConnectionsSettingsPage() {
  return (
    <section className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-6">
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />

        <DashboardPageHeader
          title="Dispositivos"
          subtitle="Gerencie os dispositivos conectados à sua conta."
          icon={<Server size={24} />}
        />
      </div>
    </section>
  );
}
