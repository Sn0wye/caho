import { BetaAlert } from '@/components/beta-alert';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { type ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <TooltipProvider>
      <div className="flex h-full min-h-screen">
        <DashboardSidebar />

          <main className="flex flex-1 flex-col gap-10 p-8 items-center">
            <BetaAlert />
            {children}
          </main>
      </div>
    </TooltipProvider>
  );
}
