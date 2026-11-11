'use client';

import { useState } from 'react';
import { Check, ChevronDown, Gavel, WifiOff } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useGame } from '@/hooks/game';
import { fx } from '../store';
import { useSeats, type Stage } from '../use-table';
import { glass } from './glass';

/** Top-left collapsible list of players with seat colour, score and status. */
export function Scoreboard({ stage }: { stage: Stage }) {
  const [isOpen, setIsOpen] = useState(true);
  const { room, judgeId } = useGame();
  const { seats } = useSeats();

  const isLobby = stage.kind === 'lobby';
  const isRound = stage.kind === 'playing' || stage.kind === 'judging';
  const rows = [...seats].sort((a, b) => b.player.score - a.player.score);

  return (
    <div
      className={cn(
        glass,
        'pointer-events-none w-52 overflow-hidden rounded-2xl text-xs'
      )}
    >
      <button
        type="button"
        onClick={() => {
          fx.emit({ type: 'ui-click' });
          setIsOpen(open => !open);
        }}
        className="pointer-events-auto flex w-full items-center justify-between px-3 py-2 font-semibold text-zinc-200 hover:bg-white/5"
        aria-expanded={isOpen}
      >
        <span>{isLobby ? 'Jogadores' : 'Placar'}</span>
        <span className="flex items-center gap-1.5 font-normal text-zinc-500">
          {!isLobby && `até ${room.maxPoints}`}
          <ChevronDown
            size={14}
            className={cn('transition-transform', !isOpen && '-rotate-90')}
          />
        </span>
      </button>

      {isOpen && (
        <ul className="flex max-h-[40vh] flex-col gap-0.5 overflow-y-auto px-1.5 pb-1.5">
          {rows.map(({ player, color, isSelf }) => {
            const isRoundJudge = isRound && player.id === judgeId;
            const isDone =
              player.isReady &&
              (isLobby || (stage.kind === 'playing' && !isRoundJudge));
            return (
              <li
                key={player.id}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-1.5 py-1',
                  isSelf && 'bg-white/8',
                  !player.isActive && 'opacity-40'
                )}
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{
                    background: color,
                    boxShadow: `0 0 8px ${color}88`
                  }}
                />
                <span className="flex-1 truncate text-zinc-100">
                  {player.username}
                  {isSelf && <span className="text-zinc-500"> (você)</span>}
                </span>
                {isRoundJudge && (
                  <Gavel
                    size={12}
                    className="text-amber-300"
                    aria-label="Juiz"
                  />
                )}
                {isDone && (
                  <Check
                    size={12}
                    className="text-emerald-400"
                    aria-label={isLobby ? 'Pronto' : 'Jogou'}
                  />
                )}
                {!player.isActive && <WifiOff size={12} aria-label="Inativo" />}
                {!isLobby && (
                  <span className="font-mono text-zinc-300 tabular-nums">
                    {player.score}
                    <span className="text-zinc-600">/{room.maxPoints}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
