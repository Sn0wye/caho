import { cn } from '@/utils/cn';
import Link, { type LinkProps } from 'next/link';
import { type ReactNode } from 'react';
import { Noise } from '../illustrations/noise';

type BackgroundColors = 'yellow' | 'purple' | 'teal';

interface DashboardOptionCardProps {
  title: string;
  description: string;
  bgColor: BackgroundColors;
  icon: ReactNode;
  href?: LinkProps['href'];
  as?: 'button' | 'a';
}

const backgroundColorVariants: { [key in BackgroundColors]: string } = {
  yellow: 'hover:bg-yellow-600',
  purple: 'hover:bg-purple-500',
  teal: 'hover:bg-teal-600'
};

const darkShadowVariants: { [key in BackgroundColors]: string } = {
  yellow: 'dark:hover:shadow-yellow-600',
  purple: 'dark:hover:shadow-purple-500',
  teal: 'dark:hover:shadow-teal-600'
};

export function DashboardOptionCard({
  title,
  description,
  bgColor,
  icon,
  as = 'a',
  href,
  ...rest
}: DashboardOptionCardProps) {
  const Wrapper = as === 'a' ? Link : 'button';

  return (
    // @ts-expect-error - href is present when as is 'a'. Unfortunately, TypeScript doesn't know that.
    <Wrapper
      {...(as === 'a' ? { href } : {})}
      className={cn(
        'group relative flex w-full flex-col justify-between gap-6 rounded-md p-6 text-left transition-all hover:-translate-y-2 hover:translate-x-2 hover:shadow-[-8px_8px] hover:shadow-zinc-950',
        'bg-zinc-100',
        'dark:bg-zinc-900/20 dark:hover:bg-gradient-to-br dark:hover:from-zinc-900 dark:hover:via-zinc-900 dark:hover:to-zinc-700 ',
        backgroundColorVariants[bgColor],
        darkShadowVariants[bgColor]
      )}
      {...rest}
    >
      <Noise className="hidden rounded-md group-hover:block" />

      <figure className="flex h-fit w-fit items-center justify-center p-2 text-zinc-500 group-hover:text-zinc-50 dark:text-zinc-600">
        {icon}
      </figure>

      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-zinc-500 group-hover:text-zinc-50 dark:text-zinc-300">
          {title}
        </h2>
        <span className=" text-zinc-400 group-hover:text-zinc-100 dark:text-zinc-500">
          {description}
        </span>
      </header>
    </Wrapper>
  );
}
