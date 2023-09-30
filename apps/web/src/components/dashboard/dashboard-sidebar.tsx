import { Home, Plus, Settings } from 'lucide-react';
import { Suspense } from 'react';
import { LogoIcon } from '../brand/logo-icon';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { DashboardSidebarItem } from './dashboard-sidebar-item';
import { DashboardUserNav } from './dashboard-user-nav';

interface DashboardSidebarProps {}

export function DashboardSidebar({}: DashboardSidebarProps) {
  return (
    <aside className="sticky top-0 flex h-screen flex-col items-center justify-between bg-accent/5 py-6">
      <header className="flex w-full flex-col items-center gap-6">
        <LogoIcon size="md" />
        <Separator className="w-2/3" />
      </header>

      <nav className="flex flex-1 flex-col gap-3 py-6">
        <DashboardSidebarItem
          icon={<Home size={20} />}
          label="Dashboard"
          href="/dashboard"
        />

        <DashboardSidebarItem
          icon={<Plus size={20} />}
          label="Nova sala"
          href="/dashboard/create-room"
        />

        <DashboardSidebarItem
          icon={<Settings size={20} />}
          label="Configurações"
          href="/dashboard/settings"
        />
      </nav>

      <div className="flex w-full flex-col items-center gap-6">
        <Separator className="w-2/3" />

        <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
          <DashboardUserNav />
        </Suspense>
      </div>
    </aside>
  );
}
