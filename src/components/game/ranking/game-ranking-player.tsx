import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import type { RoomPlayer } from '@/schemas';
import { GameRankingPlayerAvatar } from './game-ranking-player-avatar';
import { useGameRankingSidebarContext } from './game-ranking-sidebar';

type GameRankingPlayerProps = {
  player: RoomPlayer;
  isJudge: boolean;
  // Mid-game `isReady`: the Player already played this Round.
  hasPlayed: boolean;
  isCurrentUser: boolean;
};

export function GameRankingPlayer({
  player,
  isJudge,
  hasPlayed,
  isCurrentUser
}: GameRankingPlayerProps) {
  const { isCollapsed } = useGameRankingSidebarContext();

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg p-1 transition-colors',
        'hover:bg-zinc-100 dark:hover:bg-zinc-900/50',
        isCollapsed ? 'w-fit justify-center' : 'w-full justify-between px-3'
      )}
    >
      <GameRankingPlayerAvatar
        player={player}
        isJudge={isJudge}
        hideBadge={!isCollapsed}
      />

      {!isCollapsed && (
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-lg font-medium text-zinc-700 dark:text-zinc-300">
              {player.username}
              {isCurrentUser && (
                <span className="ml-1 text-sm font-normal text-zinc-500">
                  (você)
                </span>
              )}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-500">
              {player.score} {player.score === 1 ? 'ponto' : 'pontos'}
            </span>
          </div>

          <div className="flex w-fit flex-col items-end justify-center gap-1">
            {player.isHost && (
              <Badge variant="teal" className="uppercase">
                Host
              </Badge>
            )}

            {isJudge && (
              <Badge variant="orange" className="uppercase">
                Juiz
              </Badge>
            )}

            {!player.isActive && (
              <Badge variant="ghost" className="uppercase">
                Offline
              </Badge>
            )}

            {hasPlayed && !isJudge && (
              <Badge variant="secondary" className="gap-1 uppercase">
                <Check size={12} /> Jogou
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
