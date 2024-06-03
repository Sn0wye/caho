import type { ReactNode } from 'react';
import { BetaAlert } from '@/components/beta-alert';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-full min-h-screen">
      <DashboardSidebar />

      <main className="flex flex-1 flex-col items-center gap-10 p-8">
        <BetaAlert />
        {children}
      </main>
    </div>
  );
}
