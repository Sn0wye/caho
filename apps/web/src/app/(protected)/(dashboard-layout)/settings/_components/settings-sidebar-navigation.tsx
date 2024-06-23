'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';

const settingsSidebarLinks = [
  { href: '/dashboard/settings', title: 'Perfil' },
  { href: '/dashboard/settings/themes', title: 'Aparência' }
];

export function SettingsSidebarNavigation() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full max-w-xs flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold sm:text-2xl">Configurações</h3>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          Algumas telas ainda estão em construção.
        </span>
      </header>

      <nav className="flex flex-col gap-2">
        {settingsSidebarLinks.map(({ href, title }) => {
          return (
            <Link
              key={href}
              href={href}
              data-current={pathname === href}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'justify-start',
                'data-[current=true]:bg-zinc-200 data-[current=true]:hover:bg-zinc-200 data-[current=true]:dark:bg-zinc-800 data-[current=true]:dark:hover:bg-zinc-800'
              )}
            >
              {title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
