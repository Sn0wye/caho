import Link from 'next/link';
import { siteConfig } from 'config/site';
import { LogoIcon } from './logo-icon';

export function LogoText() {
  return (
    <Link href={'/'} className="flex w-fit items-center gap-2">
      <LogoIcon />
      <span className="text-xl font-bold md:text-2xl">
        {siteConfig.nameShort}
      </span>
    </Link>
  );
}
