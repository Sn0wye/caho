import { SignedIn } from '@clerk/nextjs';
import { Home, LogOut, Plus } from 'lucide-react';
import { LogoIcon } from '../brand/logo-icon';
import { ThemeSwitcher } from '../theme-switcher';
import { Separator } from '../ui/separator';
import { DashboardSidebarItem } from './dashboard-sidebar-item';

interface DashboardSidebarProps {}

export function DashboardSidebar({}: DashboardSidebarProps) {
  return (
    <aside className="sticky top-0 flex h-screen flex-col items-center justify-between border-r border-zinc-100  bg-zinc-50 py-6 dark:border-zinc-900/75 dark:bg-zinc-950">
      <header className="flex w-full flex-col items-center gap-6">
        <LogoIcon size="md" />
        <Separator className="w-2/3" />
      </header>

      <nav className="flex flex-1 flex-col gap-3 py-6">
        <DashboardSidebarItem
          icon={<Home size={24} />}
          label="Dashboard"
          href="/dashboard"
          isActive
        />

        <DashboardSidebarItem
          icon={<Plus size={24} />}
          label="Nova sala"
          href="/dashboard"
        />
      </nav>

      <div className="flex w-full flex-col items-center gap-3">
        <Separator className="mb-3 w-2/3" />

        <ThemeSwitcher />

        <SignedIn>
          <DashboardSidebarItem
            icon={<LogOut size={20} />}
            label="Sair do sistema"
            href="/dashboard"
          />
        </SignedIn>
      </div>
    </aside>
  );
}
