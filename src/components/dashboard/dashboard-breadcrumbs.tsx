import { cn } from '@/utils/cn';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

export type BreadcrumbType = {
  label: string;
  href: string;
};

type DashboardBreadcrumbsProps = {
  breadcrumbs: BreadcrumbType[];
};

export function DashboardBreadcrumbs({
  breadcrumbs
}: DashboardBreadcrumbsProps) {
  return (
    <nav className="flex items-center">
      {breadcrumbs.map((breadcrumb, index) => (
        <Fragment key={breadcrumb.href}>
          <DashboardBreadcrumb
            label={breadcrumb.label}
            href={breadcrumb.href}
            isCurrentPage={index === breadcrumbs.length - 1}
          />
          {index !== breadcrumbs.length - 1 && <DashboardBreadcrumbSeparator />}
        </Fragment>
      ))}
    </nav>
  );
}

type DashboardBreadcrumbProps = {
  label: string;
  href: string;
  isCurrentPage?: boolean;
};

function DashboardBreadcrumb({
  label,
  href,
  isCurrentPage
}: DashboardBreadcrumbProps) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded px-1.5 py-1 text-sm font-medium leading-none text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-600 dark:hover:bg-zinc-900 dark:hover:text-zinc-400',
        isCurrentPage &&
          'text-zinc-500 hover:cursor-default hover:bg-transparent hover:text-zinc-500 dark:text-zinc-400 dark:hover:bg-transparent hover:dark:text-zinc-400'
      )}
    >
      {label}
    </Link>
  );
}

function DashboardBreadcrumbSeparator() {
  return <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-500 " />;
}
