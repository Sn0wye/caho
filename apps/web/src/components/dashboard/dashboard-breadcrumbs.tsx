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
    <nav className="flex items-center gap-2">
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
        'text-sm font-medium leading-none text-muted-foreground transition-all',
        isCurrentPage ? 'hover:cursor-default' : 'opacity-50 hover:opacity-75',
      )}
    >
      {label}
    </Link>
  );
}

function DashboardBreadcrumbSeparator() {
  return <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50" />;
}
