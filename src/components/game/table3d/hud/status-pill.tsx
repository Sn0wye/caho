'use client';

import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useGame } from '@/hooks/game';
import { useLobby } from '../../lobby/use-lobby';
import type { Stage } from '../use-table';
import { glass } from './glass';

const URGENT_SECONDS = 10;

function Countdown({ deadline }: { deadline: Date | null }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!deadline) return null;
  const left = Math.max(0, Math.ceil((deadline.getTime() - now) / 1000));
  const isUrgent = left <= URGENT_SECONDS;

  return (
    <span
      role="timer"
      aria-label={`${left} segundos restantes`}
      className={cn(
        'flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs font-bold tabular-nums',
        isUrgent
          ? 'animate-pulse bg-red-500/20 text-red-300'
          : 'bg-white/8 text-zinc-300'
      )}
    >
      <Timer size={12} />
      {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}
    </span>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-amber-300/15 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-amber-200 uppercase">
      {children}
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        glass,
        'flex max-w-[min(92vw,44rem)] flex-col items-center gap-0.5 rounded-2xl px-4 py-2 text-center'
      )}
    >
      {children}
    </div>
  );
}

function LobbyPill() {
  const lobby = useLobby();
  const active = lobby.players.filter(player => player.isActive).length;

  return (
    <Pill>
      <div className="flex items-center gap-2">
        <Badge>Sala</Badge>
        <h2 className="text-sm font-semibold text-zinc-100">
          Aguardando jogadores
        </h2>
      </div>
      <span className="text-xs text-zinc-400">
        {active}/{lobby.room.maxPlayers} jogadores · {lobby.readyCount} prontos
        · {lobby.room.maxPoints} pontos para vencer
      </span>
      <span className="text-xs text-amber-200/80">{lobby.status}</span>
    </Pill>
  );
}

function RoundPill({ stage }: { stage: 'playing' | 'judging' }) {
  const { round, isJudge, hasPlayed, players, judgeId } = useGame();
  if (!round) return null;

  const contenders = players.filter(p => p.isActive && p.id !== judgeId);
  const playedCount = contenders.filter(p => p.isReady).length;
  const pick = round.blackCard?.pick ?? 1;
  const isJudging = stage === 'judging';

  const title = isJudging
    ? isJudge
      ? 'Escolha a resposta vencedora'
      : 'O juiz está escolhendo...'
    : isJudge
      ? 'Você é o juiz desta rodada'
      : hasPlayed
        ? 'Esperando os outros jogadores'
        : pick > 1
          ? `Escolha ${pick} cartas, na ordem`
          : 'Escolha sua carta';

  return (
    <Pill>
      <div className="flex items-center gap-2.5">
        <Badge>{`Rodada ${round.number}`}</Badge>
        <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
        <Countdown
          deadline={isJudging ? round.judgeDeadline : round.playDeadline}
        />
      </div>
      {!isJudging && (
        <span className="text-xs text-zinc-400">
          {playedCount}/{contenders.length} jogaram
        </span>
      )}
    </Pill>
  );
}

/** The top-centre pill: lobby facts or the round's title, count and timer. */
export function StatusPill({ stage }: { stage: Stage }) {
  if (stage.kind === 'lobby') return <LobbyPill />;
  if (stage.kind === 'playing' || stage.kind === 'judging') {
    return <RoundPill stage={stage.kind} />;
  }
  return null;
}
