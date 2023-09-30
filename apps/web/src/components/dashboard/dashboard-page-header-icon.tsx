import { type ReactNode } from 'react';

interface DashboardPageHeaderIconProps {
  icon: ReactNode;
}

export function DashboardPageHeaderIcon({
  icon
}: DashboardPageHeaderIconProps) {
  return (
    <figure className="flex h-full w-fit items-center justify-center rounded-md bg-gradient-to-br from-accent/10 via-accent/10 to-accent p-2 text-muted-foreground">
      {icon}
    </figure>
  );
}
