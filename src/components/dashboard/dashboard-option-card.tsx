import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

type DashboardOptionCardProps = {
  title: string;
  description: string;
  href: string;
  fillContainer?: boolean;
};

export function DashboardOptionCard({
  title,
  description,
  href,
  fillContainer
}: DashboardOptionCardProps) {
  return (
    <Link href={href} className={cn(fillContainer && 'col-span-2')}>
      <Card className="transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
