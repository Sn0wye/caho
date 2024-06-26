import type { ReactNode } from 'react';
import { SettingsSidebarNavigation } from './_components/settings-sidebar-navigation';

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
