'use client';

import { type ComponentProps, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Button } from '../ui/button';
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
              "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-r-sm before:bg-zinc-900 before:p-px before:content-[''] hover:cursor-not-allowed before:dark:bg-zinc-200"
          )}
        >
          <Button
            variant="transparent"
            className={cn(
              isActive &&
                'text-zinc-900 hover:cursor-not-allowed hover:bg-transparent dark:text-zinc-50 hover:dark:bg-transparent',
              props.className
            )}
            size="icon"
            asChild
          >
            <Link {...props}>
              {props.icon}
              <span className="sr-only">{props.label}</span>
            </Link>
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        <span>{props.label}</span>
      </TooltipContent>
    </Tooltip>
  );
}
