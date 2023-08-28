import { cn } from '@/utils/cn';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardBreadcrumbsProps {}

export function DashboardBreadcrumbs({}: DashboardBreadcrumbsProps) {
  return (
    <nav className="flex items-center">
      <DashboardBreadcrumb label="Dashboard" href="/dashboard" />
      <DashboardBreadcrumbSeparator />
      <DashboardBreadcrumb label="Nova sala" href="/dashboard/create-room" isCurrentPage/>
    </nav>
  );
}

function DashboardBreadcrumb({
  label,
  href,
  isCurrentPage
}: {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'leading-none rounded px-1.5 py-0.5 text-sm text-zinc-600 dark:text-zinc-400 transition-all hover:text-geist-dark-purple hover:bg-geist-dark-purple/10 dark:hover:text-geist-dark-purple',
        isCurrentPage && 'text-zinc-800 dark:text-zinc-200 hover:bg-transparent dark:hover:bg-transparent hover:text-zinc-800 hover:dark:text-zinc-200 hover:cursor-default'
      )}
    >
      {label}
    </Link>
  );
}

function DashboardBreadcrumbSeparator() {
  return (
    <ChevronRight className="w-4 h-4 text-zinc-500" />
  );
}
