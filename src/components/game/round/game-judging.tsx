'use client';

import { Check, Gavel, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { BlackCard } from '../cards/black-card';
import { useJudgePick } from './use-judge-pick';

// The judging phase: every answer shown as its completed Black Card, without
// names. Only the Judge can pick; everyone else watches the same table.
export function GameJudging() {
  const {
    round,
    isJudge,
    answers,
    chosenPlayerId,
    setChosenPlayerId,
    confirmWinner,
    isPending
  } = useJudgePick();

  if (!round) return null;

  return (
    <section className="relative flex flex-1 flex-col items-center gap-8 overflow-y-auto p-8">
      <header className="flex max-w-xl flex-col items-center gap-2 text-center">
        <figure className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-400/10 text-orange-400">
          <Gavel size={22} />
        </figure>
        <h3 className="text-2xl font-bold sm:text-3xl">
          {isJudge ? 'Hora do julgamento!' : 'O juiz está deliberando...'}
        </h3>
        <span className="text-sm text-balance text-zinc-500 dark:text-zinc-400">
          {isJudge
            ? 'Escolha a atrocidade que mais te fez passar vergonha alheia. Ninguém sabe quem jogou o quê.'
            : 'Torça pra sua resposta ser a pior de todas. As cartas estão na mesa.'}
        </span>
      </header>

      <div className="flex flex-wrap items-start justify-center gap-6">
        {answers.map((answer, index) => {
          const isChosen = chosenPlayerId === answer.player.id;

          return (
            <div key={answer.id} className="flex flex-col items-center gap-3">
              <button
                type="button"
                disabled={!isJudge || isPending}
                onClick={() => setChosenPlayerId(answer.player.id)}
                aria-pressed={isChosen}
                aria-label={`Resposta ${index + 1}`}
                className={cn(
                  'rounded-xl transition-all',
                  isJudge && 'hover:-translate-y-2 hover:cursor-pointer',
                  isChosen &&
                    'ring-4 ring-orange-400 ring-offset-4 ring-offset-white dark:ring-offset-zinc-950'
                )}
              >
                <BlackCard
                  size="sm"
                  card={round.blackCard}
                  answers={answer.whiteCards}
                />
              </button>

              {isJudge && isChosen && (
                <Button
                  onClick={() => confirmWinner(answer.player.id)}
                  disabled={isPending}
                  className="gap-2"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  Essa é a pior!
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute top-1/3 left-1/2 -z-10 aspect-square w-1/3 -translate-x-1/2 rounded-full blur-[320px] dark:bg-orange-500/20" />
    </section>
  );
}
