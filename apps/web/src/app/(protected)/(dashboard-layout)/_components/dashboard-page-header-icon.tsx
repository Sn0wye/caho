import type { ReactNode } from 'react';
import { Noise } from '@/components/illustrations/noise';

interface DashboardPageHeaderIconProps {
  icon: ReactNode;
}

export function DashboardPageHeaderIcon({
  icon
}: DashboardPageHeaderIconProps) {
  return (
    <figure className="relative -z-10 flex h-full w-fit items-center justify-center rounded-md bg-gradient-to-br from-zinc-50 via-zinc-50 to-zinc-300 p-2 text-zinc-500 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-600 dark:text-zinc-300">
      <Noise className="rounded-md" />
      {icon}
    </figure>
  );
}
