'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Ban, Trophy } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useGame } from '@/hooks/game';
import type { Stage } from '../use-table';
import { glass } from './glass';

/** Upper-third banner for a Round's result; the celebration is in 3D. */
export function ResultBanner({ stage }: { stage: Stage }) {
  const { currentPlayer } = useGame();
  const result = stage.kind === 'result' ? stage.result : null;

  const isPicked = !!result && result.reason === 'picked' && !!result.winner;
  const isMine = !!result && result.winnerId === currentPlayer?.id;
  const score = result?.newScore ?? 0;

  return (
    <div className="absolute inset-x-0 top-[17%] flex justify-center px-4">
      <AnimatePresence>
        {result && (
          <motion.div
            key={result.roundNumber}
            initial={{ opacity: 0, y: -24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className={cn(
              glass,
              'flex items-center gap-4 rounded-3xl px-6 py-4',
              isPicked && 'border-amber-300/30'
            )}
          >
            <span
              className={cn(
                'flex size-12 shrink-0 items-center justify-center rounded-full',
                isPicked
                  ? 'bg-amber-300/15 text-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.35)]'
                  : 'bg-white/8 text-zinc-400'
              )}
            >
              {isPicked ? <Trophy size={24} /> : <Ban size={24} />}
            </span>
            <div className="flex max-w-md flex-col">
              <span className="font-mono text-[10px] tracking-wide text-zinc-500 uppercase">
                Rodada {result.roundNumber}
              </span>
              <h2 className="text-2xl leading-tight font-bold text-zinc-50">
                {isPicked
                  ? isMine
                    ? 'Você levou essa!'
                    : `${result.winner?.player.username} levou essa!`
                  : 'Rodada anulada'}
              </h2>
              <p className="text-sm text-zinc-400">
                {isPicked
                  ? `Agora com ${score} ${score === 1 ? 'ponto' : 'pontos'}. Que orgulho... ou não.`
                  : 'O juiz sumiu ou ninguém jogou a tempo. Ninguém pontua, e o próximo juiz assume.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
