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

export function DashboardBreadcrumbs({ breadcrumbs }: DashboardBreadcrumbsProps) {
  return (
    <nav className="flex items-center">
      {breadcrumbs.map((breadcrumb, index) => (
        <Fragment key={breadcrumb.href}>
          <DashboardBreadcrumb
            label={breadcrumb.label}
            href={breadcrumb.href}
            isCurrentPage={index === breadcrumbs.length - 1}
          />
          {index !== breadcrumbs.length - 1 && (
            <DashboardBreadcrumbSeparator />
          )}
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
        'rounded px-1.5 py-0.5 text-sm leading-none text-zinc-600 transition-all hover:bg-geist-dark-purple/10 hover:text-geist-dark-purple dark:text-zinc-400 dark:hover:text-geist-dark-purple',
        isCurrentPage &&
          'text-zinc-800 hover:cursor-default hover:bg-transparent hover:text-zinc-800 dark:text-zinc-200 dark:hover:bg-transparent hover:dark:text-zinc-200'
      )}
    >
      {label}
    </Link>
  );
}

function DashboardBreadcrumbSeparator() {
  return <ChevronRight className="h-4 w-4 text-zinc-500" />;
}
