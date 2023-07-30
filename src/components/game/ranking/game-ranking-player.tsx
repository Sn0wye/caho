import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

// TODO: Change types to match the real ones from the API.
type GameRankingPlayerProps = {
  data: {
    isHost?: boolean;
    isJudge?: boolean;
    name: string;
    score: number;
    avatarSrc: string;
    initials: string;
    isConnected?: boolean;
  };
};

export function GameRankingPlayer({ data }: GameRankingPlayerProps) {
  const { avatarSrc, isHost, isJudge, initials, name, isConnected, score } =
    data;

  return (
    <div
      className={cn(
        'flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg p-4 transition-colors',
        isConnected
          ? 'hover:bg-zinc-100 dark:hover:bg-zinc-900/50'
          : 'cursor-not-allowed opacity-50'
      )}
    >
      <Avatar variant={!isConnected ? 'ghost' : null}>
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex w-full flex-col">
          <span className="w-36 truncate text-lg font-medium text-zinc-700 dark:text-zinc-300">
            {name}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-500">
            {score} pontos
          </span>
        </div>

        <div className="flex w-fit flex-col items-end justify-center gap-1">
          {isHost && <Badge variant="purple">Host</Badge>}
          {isJudge && <Badge variant="orange">Juiz</Badge>}
        </div>
      </div>
    </div>
  );
}
