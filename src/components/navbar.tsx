import Link from 'next/link';
import { siteConfig } from 'config/site';
import { ThemeSwitcher } from './theme-switcher';
import { Button } from './ui/button';

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  return (
    <nav className="sticky left-0 top-0 flex h-20 w-full items-center justify-between border-b border-zinc-300 bg-white px-8 py-4 dark:border-zinc-800 dark:bg-black">
      <span className="text-2xl font-bold md:text-3xl">
        {siteConfig.nameShort}
      </span>

      <div className="flex h-full w-fit items-center gap-4">
        <ThemeSwitcher />

        <Button asChild>
          <Link href="/auth/login" className="text-lg font-bold">
            Entra aqui!
          </Link>
        </Button>
      </div>
    </nav>
  );
}
