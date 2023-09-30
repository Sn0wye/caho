import { type ReactNode } from 'react';
import { DashboardPageHeaderIcon } from './dashboard-page-header-icon';

interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
}

export function DashboardPageHeader({
  title,
  subtitle,
  icon
}: DashboardPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <DashboardPageHeaderIcon icon={icon} />

      <div className="flex w-full flex-col gap-1">
        <h1 className="text-2xl font-bold sm:text-3xl text-secondary-foreground">{title}</h1>
        {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
      </div>
    </header>
  );
}
