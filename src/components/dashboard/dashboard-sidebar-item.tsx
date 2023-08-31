import { cn } from '@/utils/cn';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface DashboardSidebarItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

export function DashboardSidebarItem({
  icon,
  label,
  href,
  isActive = false,
}: DashboardSidebarItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={cn(
          "relative flex w-16 items-center justify-center", 
          isActive && "hover:cursor-not-allowed before:absolute before:content-[''] before:w-1 before:h-full before:rounded-r-sm before:bg-zinc-900 before:dark:bg-zinc-200 before:left-0 before:top-0 before:p-px"
          )
        }>
          <Button variant="transparent" className={cn(isActive && "text-zinc-900 dark:text-zinc-50 hover:bg-transparent hover:dark:bg-transparent hover:cursor-not-allowed")} size="icon" asChild>
            <Link href={href}>
              {icon}
              <span className="sr-only">{label}</span>
            </Link>
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={4}>
        <span>{label}</span>
      </TooltipContent>
    </Tooltip>
  );
}
