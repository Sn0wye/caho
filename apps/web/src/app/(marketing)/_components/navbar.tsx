import Link from 'next/link';
import { LogoText } from '@/components/brand/logo-text';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';

//TODO: SignedIn and SignedOut components
export function Navbar() {
  return (
    <nav className="sticky left-0 top-0 flex w-full items-center justify-between border-b py-4 dark:border-b-zinc-900">
      <LogoText />

      <div className="flex h-full w-fit items-center gap-4">
        <ThemeSwitcher tooltipSide="bottom" />

        {/* <SignedIn> */}
        <Button asChild>
          <Link href="/dashboard" className="text-lg font-bold">
            Dashboard
          </Link>
        </Button>
        {/* </SignedIn> */}
        {/* <SignedOut>
          <Button asChild>
            <Link href="/sign-in" className="text-lg font-bold">
              Entra aqui!
            </Link>
          </Button>
        </SignedOut> */}
      </div>
    </nav>
  );
}
