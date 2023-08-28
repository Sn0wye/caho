import { siteConfig } from 'config/site';
import Link from 'next/link';
import { LogoIcon } from './logo-icon';

interface LogoTextProps {}

export function LogoText({}: LogoTextProps) {
  return (
    <Link href={'/'} className="flex items-center gap-2">
      <LogoIcon />
      <span className="text-xl font-bold md:text-2xl">
        {siteConfig.nameShort}
      </span>
    </Link>
  );
}
