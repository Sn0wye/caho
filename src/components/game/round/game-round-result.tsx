'use client';

import { Ban, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useGame } from '@/hooks/game';
import { BlackCard } from '../cards/black-card';

// Shown for a few seconds after each Round, over whatever comes next (the next
// Round or the final Ranking).
export function GameRoundResult() {
  const { lastResult, dismissResult, currentPlayer } = useGame();

  if (!lastResult) return null;

  const isPicked = lastResult.reason === 'picked' && !!lastResult.winner;
  const isMine = lastResult.winnerId === currentPlayer?.id;
  const winnerName = lastResult.winner?.player.username;

  return (
    <Dialog open onOpenChange={open => !open && dismissResult()}>
      <DialogContent className="flex max-w-md flex-col items-center gap-6 p-8 text-center">
        <figure
          className={
            isPicked
              ? 'flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500'
              : 'flex h-12 w-12 items-center justify-center rounded-full bg-zinc-500/10 text-zinc-500'
          }
        >
          {isPicked ? <Trophy size={22} /> : <Ban size={22} />}
        </figure>

        <DialogHeader className="items-center space-y-2 text-center sm:text-center">
          <span className="font-mono text-xs text-zinc-500 uppercase">
            Rodada {lastResult.roundNumber}
          </span>
          <DialogTitle className="text-3xl font-bold">
            {isPicked
              ? isMine
                ? 'Você levou essa!'
                : `${winnerName} levou essa!`
              : 'Rodada anulada'}
          </DialogTitle>
          <DialogDescription>
            {isPicked
              ? `Agora com ${lastResult.newScore} ${lastResult.newScore === 1 ? 'ponto' : 'pontos'}. Que orgulho... ou não.`
              : 'O juiz sumiu ou ninguém jogou a tempo. Ninguém pontua, e o próximo juiz assume.'}
          </DialogDescription>
        </DialogHeader>

        {isPicked && lastResult.winner && (
          <BlackCard
            size="sm"
            card={lastResult.blackCard}
            answers={lastResult.winner.whiteCards}
          />
        )}

        <Button variant="ghost" onClick={dismissResult}>
          Próxima rodada
        </Button>
      </DialogContent>
    </Dialog>
  );
}
