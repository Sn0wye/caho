import { Skeleton } from '@/components/ui/skeleton';

export function PublicGameRoomCardSkeleton() {
  return (
    <figure className="flex cursor-not-allowed flex-col justify-between gap-6 border border-zinc-200/50 bg-white/20 p-6 dark:border-zinc-900/50 dark:bg-zinc-900/20">
      <Skeleton className="h-8 w-9/12" />

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-4/12" />
        <Skeleton className="h-5 w-5/12" />
        <Skeleton className="h-5 w-3/12" />
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-7/12" />
        <Skeleton className="h-3 w-4/12" />
      </div>
    </figure>
  );
}
