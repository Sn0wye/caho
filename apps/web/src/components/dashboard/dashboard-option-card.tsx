import Link, { type LinkProps } from 'next/link';
import { type ReactNode } from 'react';

interface DashboardOptionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href?: LinkProps['href'];
  as?: 'button' | 'a';
}

export function DashboardOptionCard({
  title,
  description,
  icon,
  as = 'a',
  href,
  ...rest
}: DashboardOptionCardProps) {
  const Wrapper = as === 'a' ? Link : 'button';

  return (
    // @ts-expect-error -  Even though we are checking for the `as` prop, TS is not smart enough to understand that
    <Wrapper
      {...(as === 'a' ? { href } : {})}
      className='group flex w-full flex-col justify-between gap-6 rounded-md p-6 text-left transition-all bg-accent/25 hover:bg-accent'
      {...rest}
    >

      <figure className="flex h-fit w-fit items-center justify-center p-2 text-muted-foreground group-hover:text-card-foreground">
        {icon}
      </figure>

      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-muted-foreground group-hover:text-card-foreground">
          {title}
        </h2>
        <span className="text-muted-foreground">
          {description}
        </span>
      </header>
    </Wrapper>
  );
}
