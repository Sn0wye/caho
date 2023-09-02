import { SettingsSidebarNavigation } from '@/components/dashboard/settings/settings-sidebar-navigation';
import { type ReactNode } from 'react';

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex h-full w-full items-start gap-20">
      <SettingsSidebarNavigation />
      {children}
    </div>
  );
}
