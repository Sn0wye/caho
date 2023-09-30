'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ComponentProps, type ReactNode } from 'react';
import { buttonVariants } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type DashboardSidebarItemProps = ComponentProps<typeof Link> & {
  icon: ReactNode;
  label: string;
};

export function DashboardSidebarItem(props: DashboardSidebarItemProps) {
  const pathname = usePathname();

  const isActive = pathname === props.href;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={cn(
            'relative flex w-16 items-center justify-center',
            isActive &&
            "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-r-sm before:bg-secondary-foreground before:p-px before:content-[''] hover:cursor-not-allowed"
          )}
        >
          <Link
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size: 'icon'
              }),

              isActive ? 'text-secondary-foreground hover:cursor-not-allowed hover:bg-transparent hover:text-current' : 'text-muted-foreground opacity-70',
              props.className
            )}
            {...props}>
            {props.icon}
            <span className="sr-only">{props.label}</span>
          </Link>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        <span>{props.label}</span>
      </TooltipContent>
    </Tooltip>
  );
}
