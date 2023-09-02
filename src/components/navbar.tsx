import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import { LogoText } from './brand/logo-text';
import { ThemeSwitcher } from './theme-switcher';
import { Button } from './ui/button';

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  return (
    <nav className="sticky left-0 top-0 flex w-full items-center justify-between border-b py-4 dark:border-b-zinc-900">
      <LogoText />

      <div className="flex h-full w-fit items-center gap-4">
        <ThemeSwitcher tooltipSide="bottom" />

        <SignedIn>
          <Button asChild>
            <Link href="/dashboard" className="text-lg font-bold">
              Dashboard
            </Link>
          </Button>
        </SignedIn>
        <SignedOut>
          <Button asChild>
            <Link href="/sign-in" className="text-lg font-bold">
              Entra aqui!
            </Link>
          </Button>
        </SignedOut>
      </div>
    </nav>
  );
}
