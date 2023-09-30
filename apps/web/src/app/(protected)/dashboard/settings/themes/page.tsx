import {
  DashboardBreadcrumbs,
  type BreadcrumbType
} from '@/components/dashboard/dashboard-breadcrumbs';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { SettingsThemeSelector } from '@/components/dashboard/settings/settings-theme-selector';
import { PaintBucket } from 'lucide-react';

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
    label: 'Aparência',
    href: '/dashboard/settings/themes'
  }
];

export default function ThemesSettingsPage() {
  return (
    <section className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-6">
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />

        <DashboardPageHeader
          title="Aparência"
          subtitle="Escolha o tema que mais combina com você."
          icon={<PaintBucket size={24} />}
        />
      </div>

      <SettingsThemeSelector />
    </section>
  );
}
