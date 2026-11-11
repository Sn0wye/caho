'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Link2, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useGame } from '@/hooks/game';
import { useLobby } from '../../lobby/use-lobby';
import { usePlayCards } from '../../use-play-cards';
import { fx } from '../store';
import { useJudge, type Stage } from '../use-table';
import { glass, lampButton, popIn, quietButton } from './glass';

function Hint({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        glass,
        'rounded-full px-4 py-1.5 text-center text-sm text-zinc-300'
      )}
    >
      {children}
    </div>
  );
}

function Spinner() {
  return <Loader2 className="size-4 animate-spin" />;
}

function LobbyBar() {
  const lobby = useLobby();
  const [isCopied, setIsCopied] = useState(false);

  const copyInvite = async () => {
    fx.emit({ type: 'ui-click' });
    await navigator.clipboard.writeText(
      `${window.location.origin}/room/${lobby.room.code}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <button
        type="button"
        className={lobby.isReady ? quietButton : lampButton}
        disabled={lobby.isTogglingReady}
        onClick={() => {
          fx.emit({ type: 'ui-click' });
          lobby.toggleReady();
        }}
      >
        {lobby.isReady ? 'Calma aí' : 'Estou pronto'}
      </button>
      {lobby.isPlayerRoomHost && (
        <button
          type="button"
          className={cn(
            lobby.isReady && lobby.canStart ? lampButton : quietButton
          )}
          disabled={!lobby.canStart || lobby.isStarting}
          onClick={() => {
            fx.emit({ type: 'ui-click' });
            lobby.startGame();
          }}
        >
          {lobby.isStarting ? <Spinner /> : 'Começar jogo para todos!'}
        </button>
      )}
      <button type="button" className={quietButton} onClick={copyInvite}>
        {isCopied ? <Check size={16} /> : <Link2 size={16} />}
        {isCopied ? 'Link copiado!' : 'Copiar convite'}
      </button>
    </div>
  );
}

function PlayingBar() {
  const { isJudge, hasPlayed, isSelectionComplete, selectedCards } = useGame();
  const { submitCards, isPending } = usePlayCards();

  if (isJudge) {
    return <Hint>Você é o juiz desta rodada: espere as atrocidades</Hint>;
  }
  if (hasPlayed) return <Hint>Você já jogou. Agora é torcer.</Hint>;
  // Still choosing: the status pill already says how many, and anything here
  // would sit on the card being lifted out of the Hand.
  if (!isSelectionComplete) return null;
  return (
    <button
      type="button"
      className={lampButton}
      disabled={isPending}
      onClick={() => {
        fx.emit({ type: 'ui-click' });
        submitCards(selectedCards);
      }}
    >
      {isPending ? <Spinner /> : 'Jogar essa atrocidade'}
    </button>
  );
}

function JudgingBar() {
  const { isJudge, chosenPlayerId, confirmWinner, isPending } = useJudge();

  if (!isJudge) return <Hint>O juiz está deliberando...</Hint>;
  if (!chosenPlayerId) return <Hint>Clique na pior atrocidade da mesa.</Hint>;
  return (
    <button
      type="button"
      className={lampButton}
      disabled={isPending}
      onClick={() => {
        fx.emit({ type: 'ui-click' });
        confirmWinner(chosenPlayerId);
      }}
    >
      {isPending ? <Spinner /> : <Check size={16} />}
      Essa é a pior!
    </button>
  );
}

/**
 * Bottom-centre: the one thing to do now. While playing it sits above the 3D
 * hand (bottom 28%) so the cards stay hoverable.
 */
export function ActionBar({ stage }: { stage: Stage }) {
  const isPlaying = stage.kind === 'playing';
  const bar =
    stage.kind === 'lobby' ? (
      <LobbyBar />
    ) : isPlaying ? (
      <PlayingBar />
    ) : stage.kind === 'judging' ? (
      <JudgingBar />
    ) : null;

  return (
    <div
      className={cn(
        'absolute inset-x-0 flex justify-center px-4',
        isPlaying ? 'bottom-[30%]' : 'bottom-8'
      )}
    >
      <AnimatePresence mode="wait">
        {bar && (
          <motion.div key={`${stage.kind}`} {...popIn}>
            {bar}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
