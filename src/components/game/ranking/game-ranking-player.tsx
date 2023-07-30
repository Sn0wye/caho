import { type MockPlayer } from 'types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { GameRankingPlayerAvatar } from './game-ranking-player-avatar';
import { useGameRankingSidebarContext } from './game-ranking-sidebar';

// TODO: Change types to match the real ones from the API.
type GameRankingPlayerProps = {
  player: MockPlayer;
};

export function GameRankingPlayer({ player }: GameRankingPlayerProps) {
  const { isCollapsed } = useGameRankingSidebarContext();

  return (
    <div
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-lg p-1 transition-colors',
        player.isConnected
          ? 'hover:bg-zinc-100 dark:hover:bg-zinc-900/50'
          : 'cursor-not-allowed opacity-50',
        isCollapsed ? 'w-fit justify-center' : 'w-full justify-between px-3'
      )}
    >
      <GameRankingPlayerAvatar player={player} hideBadge={!isCollapsed} />

      {!isCollapsed && (
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex w-full flex-col">
            <span className="w-36 truncate text-lg font-medium text-zinc-700 dark:text-zinc-300">
              {player.name}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-500">
              {player.score} pontos
            </span>
          </div>

          <div className="flex w-fit flex-col items-end justify-center gap-1">
            {player.isHost && (
              <Badge variant="purple" className="uppercase">
                Host
              </Badge>
            )}
            {player.isJudge && (
              <Badge variant="orange" className="uppercase">
                Juiz
              </Badge>
            )}
            {!player.isConnected && (
              <Badge variant="ghost" className="uppercase">
                offline
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
