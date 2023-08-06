import Link from 'next/link';
import { Hash } from 'lucide-react';
import { type Room } from '@/server/schemas/room';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/card';

type PublicGameRoomCardProps = Room;

export function PublicGameRoomCard({
  code,
  maxPlayers,
  maxPoints,
  players
}: PublicGameRoomCardProps) {
  const playerAmount = players.length;

  return (
    <Link href="/game/12345">
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
            value={`${playerAmount} / ${maxPlayers}`}
          />
          <PublicGameRoomCardData
            label="pontos para acabar"
            value={maxPoints}
          />
          <PublicGameRoomCardData label="host" value={players[0]?.username} />
        </CardContent>

        <CardFooter className="flex items-center justify-between text-sm dark:text-zinc-500">
          <span className="font-medium">Atualizado por último:</span>
          {/* <span className="text-xs">{lastUpdate}</span> */}
        </CardFooter>
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
