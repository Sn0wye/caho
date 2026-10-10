'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { getUsernameInitials } from '@/utils/name';
import { useGame } from '@/hooks/game';

const PODIUM_COLORS = ['text-amber-500', 'text-zinc-400', 'text-orange-700'];

export function GameFinished() {
  const { ranking, currentPlayer } = useGame();
  const standings = ranking ?? [];
  const winner = standings[0];
  const isWinner = !!winner && winner.id === currentPlayer?.id;
  const myPosition = standings.findIndex(p => p.id === currentPlayer?.id) + 1;

  return (
    <main className="flex w-full flex-1 items-center justify-center overflow-y-auto px-8 py-8">
      <section className="flex w-full max-w-7xl grow flex-col-reverse items-center justify-between gap-12 lg:flex-row">
        <aside className="flex w-full max-w-xl flex-col gap-8">
          <h1 className="text-5xl font-extrabold sm:text-6xl md:text-7xl">
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
          <span className="leading-relaxed! md:text-xl dark:text-zinc-500">
            {isWinner
              ? 'Você é oficialmente a pior pessoa da mesa. Sua família deve estar orgulhosa.'
              : 'Tua quantidade de acertos foi tão impressionante quanto a experiência de um cego em um tiroteio.'}
          </span>

          <ol className="flex flex-col gap-2">
            {standings.map((player, index) => (
              <li
                key={player.id}
                className={cn(
                  'flex items-center gap-4 rounded-md border border-zinc-200 px-4 py-3 dark:border-zinc-900',
                  player.id === currentPlayer?.id &&
                    'bg-zinc-100 dark:bg-zinc-900/50'
                )}
              >
                <span
                  className={cn(
                    'w-6 font-mono text-lg font-bold text-zinc-500',
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
                <span className="flex-1 truncate font-medium">
                  {player.username}
                </span>
                <span className="text-sm text-zinc-500">
                  {player.score} {player.score === 1 ? 'ponto' : 'pontos'}
                </span>
              </li>
            ))}
          </ol>

          <div className="flex w-full flex-wrap items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/create-room">Jogar novamente</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/dashboard">
                Arregar... (AKA. Voltar para o Lobby)
              </Link>
            </Button>
          </div>
        </aside>

        <Image
          src="/finished-emoji.png"
          alt="Seu troféu!"
          width={320}
          height={320}
        />
      </section>
    </main>
  );
}
