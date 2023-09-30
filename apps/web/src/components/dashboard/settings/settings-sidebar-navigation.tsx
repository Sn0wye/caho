'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const settingsSidebarLinks = [
  { href: '/dashboard/settings', title: 'Perfil' },
  { href: '/dashboard/settings/themes', title: 'Aparência' },
  { href: '/dashboard/settings/connections', title: 'Dispositivos' }
];

export function SettingsSidebarNavigation() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full max-w-xs flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold sm:text-2xl text-secondary-foreground">Configurações</h3>
        <span className="text-sm text-muted-foreground">
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
                'justify-start hover:bg-transparent',
                'data-[current=true]:bg-muted data-[current=true]:hover:bg-muted',
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
