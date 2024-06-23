import { redirect } from 'next/navigation';
import { Home, Plus, Settings } from 'lucide-react';
import { getUser } from '@/auth/server';
import { LogoIcon } from '../brand/logo-icon';
import { Separator } from '../ui/separator';
import { DashboardSidebarItem } from './dashboard-sidebar-item';
import { DashboardUserNav } from './dashboard-user-nav';

export async function DashboardSidebar() {
  const user = await getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <aside className="sticky top-0 z-20 flex h-screen flex-col items-center justify-between border-r border-zinc-100  bg-zinc-50 py-6 dark:border-zinc-900/75 dark:bg-zinc-950">
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

        {/* <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}> */}
        <DashboardUserNav user={user} />
        {/* </Suspense> */}
      </div>
    </aside>
  );
}
