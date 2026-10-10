'use client';

import { Badge } from '@/components/ui/badge';
import { useGame } from '@/hooks/game';
import { GameCountdown } from './game-countdown';

export function GameRoundHeader() {
  const { round, isJudge, hasPlayed, players, judgeId } = useGame();

  if (!round) return null;

  const contenders = players.filter(p => p.isActive && p.id !== judgeId);
  const playedCount = contenders.filter(p => p.isReady).length;
  const pick = round.blackCard?.pick ?? 1;
  const isJudging = round.status === 'JUDGING';
  const deadline = isJudging ? round.judgeDeadline : round.playDeadline;

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
    <header className="flex w-full items-center justify-between gap-4 border-b border-zinc-200 px-8 py-3 dark:border-zinc-900">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="font-mono uppercase">
          Rodada {round.number}
        </Badge>
        <h2 className="font-semibold text-zinc-800 dark:text-zinc-200">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {!isJudging && (
          <span className="text-sm text-zinc-500">
            {playedCount}/{contenders.length} jogaram
          </span>
        )}
        <GameCountdown deadline={deadline} />
      </div>
    </header>
  );
}
