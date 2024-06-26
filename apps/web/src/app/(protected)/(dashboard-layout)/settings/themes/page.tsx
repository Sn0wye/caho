import { PaintBucket } from 'lucide-react';
import { DashboardPageHeader } from '../../_components/dashboard-page-header';
import { SettingsThemeSelector } from './_components/settings-theme-selector';

export default function ThemesSettingsPage() {
  return (
    <section className="flex w-full flex-col gap-12">
      <DashboardPageHeader
        title="Aparência"
        subtitle="Escolha o tema que mais combina com você."
        icon={<PaintBucket size={24} />}
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-medium leading-none text-zinc-700 dark:text-zinc-300">
            Paleta de cor
          </h3>
          <span className="text-zinc-500">
            Escolha o tema que mais combina com você.
          </span>
        </div>

        <SettingsThemeSelector />
      </div>
    </section>
  );
}
