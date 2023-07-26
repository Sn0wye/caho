import Link from 'next/link';
import { LogoText } from './brand/logo-text';
import { ThemeSwitcher } from './theme-switcher';
import { Button } from './ui/button';

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  return (
    <nav className="sticky left-0 top-0 flex h-20 w-full items-center justify-between border-b bg-white px-8 py-4 dark:bg-black">
      <LogoText />

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
