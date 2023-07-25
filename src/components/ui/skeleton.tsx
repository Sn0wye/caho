import { cn } from '@/utils/cn';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse bg-zinc-100 dark:bg-zinc-800', className)}
      {...props}
    />
  );
}

export { Skeleton };
