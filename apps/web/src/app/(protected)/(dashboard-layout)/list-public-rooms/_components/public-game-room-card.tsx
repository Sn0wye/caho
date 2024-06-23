import Link from 'next/link';
import type { Room } from '@caho/schemas';
import { Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type PublicGameRoomCardProps = Room;

function PublicGameRoomCard({
  code,
  maxPlayers,
  maxPoints,
  hostId
}: PublicGameRoomCardProps) {
  return (
    <Link href={`/room/${code}`}>
      <Card className="transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between gap-2">
            <span>Sala</span>
            <div className="flex items-center gap-1">
              <Hash size={16} className="text-geist-orange" />
              <span className="font-mono text-lg font-bold leading-none">
                {code}
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <PublicGameRoomCardData
            label="jogadores"
            value={`40 / ${maxPlayers}`}
          />
          <PublicGameRoomCardData
            label="pontos para acabar"
            value={maxPoints}
          />
          <PublicGameRoomCardData label="host" value={hostId} />
        </CardContent>

        {/* <CardFooter className="flex items-center justify-between text-sm dark:text-zinc-500">
          <span className="font-medium">Atualizado por último:</span>
          <span className="text-xs">{lastUpdate}</span>
        </CardFooter> */}
      </Card>
    </Link>
  );
}

function PublicGameRoomCardData({
  label,
  value
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">
        {label}:
      </span>
      <span className="text-zinc-500 dark:text-zinc-400">{value}</span>
    </div>
  );
}

function PublicGameRoomCardSkeleton() {
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

PublicGameRoomCard.Skeleton = PublicGameRoomCardSkeleton;

export {
  PublicGameRoomCard,
  PublicGameRoomCardData,
  PublicGameRoomCardSkeleton
};
