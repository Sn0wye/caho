import {
  DashboardBreadcrumbs,
  type BreadcrumbType
} from '@/components/dashboard/dashboard-breadcrumbs';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
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

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-medium leading-none text-zinc-700 dark:text-zinc-300">
            Paleta de cor
          </h3>
          <span className="text-zinc-500">
            Escolha o tema que mais combina com você.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-3">
            <figure className="relative h-44 w-64 rounded-md bg-zinc-900">
              <div className="absolute bottom-0 right-0 h-2/3 w-4/5 rounded-br-md rounded-tl-md bg-zinc-950 p-4 text-2xl font-medium">
                <span className="text-zinc-50">Aa</span>
              </div>
            </figure>
            <span className="text-zinc-500">Tema escuro</span>
          </div>

          <div className="flex flex-col gap-3">
            <figure className="relative h-44 w-64 rounded-md bg-zinc-200">
              <div className="absolute bottom-0 right-0 h-2/3 w-4/5 rounded-br-md rounded-tl-md bg-white p-4 text-2xl font-medium">
                <span className="text-zinc-900">Aa</span>
              </div>
            </figure>
            <span className="text-zinc-500">Tema claro</span>
          </div>

          <div className="flex flex-col gap-3">
            <figure className="relative h-44 w-64 rounded-md bg-gradient-to-r from-zinc-200 from-50% via-zinc-900 via-50% to-zinc-900">
              <div className="from-zinc-white absolute bottom-0 right-0 h-2/3 w-4/5 rounded-br-md rounded-tl-md bg-gradient-to-r from-white from-[37.5%] via-zinc-950 via-[37.5%] to-zinc-950 p-4 text-2xl font-medium">
                <span className="text-zinc-900">Aa</span>
              </div>
            </figure>
            <span className="text-zinc-500">Tema do sistema</span>
          </div>
        </div>
      </div>
    </section>
  );
}
