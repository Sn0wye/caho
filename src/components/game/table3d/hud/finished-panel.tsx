'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/cn';
import { getUsernameInitials } from '@/utils/name';
import { useGame } from '@/hooks/game';
import { fx } from '../store';
import { glass, lampButton, quietButton } from './glass';

const PODIUM_COLORS = ['text-amber-400', 'text-zinc-300', 'text-orange-500'];

/** Left-side glass panel with the headline, ranking and exits. */
export function FinishedPanel() {
  const { ranking, currentPlayer } = useGame();
  const standings = ranking ?? [];
  const winner = standings[0];
  const isWinner = !!winner && winner.id === currentPlayer?.id;
  const myPosition = standings.findIndex(p => p.id === currentPlayer?.id) + 1;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className={cn(
        glass,
        'pointer-events-auto absolute top-1/2 left-6 flex max-h-[84%] w-[min(26rem,40vw)] -translate-y-1/2 flex-col gap-3 overflow-y-auto rounded-3xl p-5'
      )}
    >
      <h1 className="text-2xl leading-tight font-extrabold text-zinc-50">
        {isWinner ? (
          <>
            Parabéns, {winner.username}! <br /> Uma bela bosta.
          </>
        ) : winner ? (
          <>
            {winner.username} venceu. <br /> E você? {myPosition}º lugar.
          </>
        ) : (
          'Acabou a baixaria.'
        )}
      </h1>
      <p className="text-sm leading-relaxed text-zinc-400 [@media(max-height:760px)]:hidden">
        {isWinner
          ? 'Você é oficialmente a pior pessoa da mesa. Sua família deve estar orgulhosa.'
          : 'Tua quantidade de acertos foi tão impressionante quanto a experiência de um cego em um tiroteio.'}
      </p>

      <ol className="flex flex-col gap-1.5">
        {standings.map((player, index) => (
          <li
            key={player.id}
            className={cn(
              'flex items-center gap-3 rounded-xl border border-white/8 px-3 py-1.5',
              player.id === currentPlayer?.id && 'bg-white/8'
            )}
          >
            <span
              className={cn(
                'w-6 font-mono text-base font-bold text-zinc-500',
                PODIUM_COLORS[index]
              )}
            >
              {index + 1}º
            </span>
            <Avatar size="sm">
              <AvatarImage src={player.avatarUrl ?? undefined} />
              <AvatarFallback>
                {getUsernameInitials(player.username)}
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate text-sm font-medium text-zinc-100">
              {player.username}
            </span>
            <span className="text-xs text-zinc-400">
              {player.score} {player.score === 1 ? 'ponto' : 'pontos'}
            </span>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-2">
        <Link
          href="/create-room"
          className={cn(lampButton, 'w-full')}
          onClick={() => fx.emit({ type: 'ui-click' })}
        >
          Jogar novamente
        </Link>
        <Link
          href="/dashboard"
          className={cn(quietButton, 'w-full')}
          onClick={() => fx.emit({ type: 'ui-click' })}
        >
          Arregar... (AKA. Voltar para o Lobby)
        </Link>
      </div>
    </motion.aside>
  );
}
