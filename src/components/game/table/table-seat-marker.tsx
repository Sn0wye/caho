'use client';

import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { useGame } from '@/hooks/game';
import { GameRankingPlayerAvatar } from '../ranking/game-ranking-player-avatar';
import type { TableSeat } from './table-seats';
import { StandingAnchor } from './table-view';

type TableSeatMarkerProps = {
  seat: TableSeat;
  children?: ReactNode;
};

// A Player's place at the table: avatar, name in their cursor colour, score.
export function TableSeatMarker({ seat, children }: TableSeatMarkerProps) {
  const { judgeId } = useGame();
  const { player, color } = seat;

  return (
    <StandingAnchor position={seat.position} perspectiveScale>
      <div
        data-testid="table-seat"
        className={cn(
          'flex w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center',
          !player.isActive && 'opacity-60'
        )}
      >
        <GameRankingPlayerAvatar
          player={player}
          isJudge={player.id === judgeId}
        />
        <span
          className="max-w-full truncate rounded-full border-2 bg-white/90 px-2 py-0.5 text-xs font-bold text-zinc-900 shadow-md dark:bg-zinc-950/90 dark:text-zinc-100"
          style={{ borderColor: color }}
        >
          {player.username}
        </span>
        <span className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
          {player.score} {player.score === 1 ? 'ponto' : 'pontos'}
        </span>
        {children}
      </div>
    </StandingAnchor>
  );
}
