import { cn } from '@/utils/cn';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('animate-pulse bg-zinc-200 dark:bg-zinc-900', className)}
      {...props}
    />
  );
}

export { Skeleton };
