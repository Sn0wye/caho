"use client";

import { BlackCard } from '@/components/game/cards/black-card';
import { GamePlayerDeck } from '@/components/game/game-player-deck';
import { LobbyPlayerAvatar } from '@/components/game/lobby/lobby-player-avatar';
import { GameNavbar } from '@/components/game/navbar/game-navbar';
import { GameRankingSidebar } from '@/components/game/ranking/game-ranking-sidebar';
import { Button } from '@/components/ui/button';
import { mockPlayers } from '@/mock/players';
import { useState } from 'react';

export default async function GamePage() {
  const [ gameStatus, setGameStatus ] = useState<'LOBBY' | 'IN_PROGRESS' | 'FINISHED'>('LOBBY');

  return (
    <div className="flex h-screen w-full flex-col items-center justify-between">
      <GameNavbar status={gameStatus} />

      <main className="flex h-[calc(100vh-4rem)] w-full flex-1">
        {gameStatus === 'LOBBY' ? (
          <section className="relative flex w-full flex-col items-center justify-center gap-8 p-8">
            <header className="flex w-full max-w-lg flex-col items-center justify-center gap-8 text-center">
              <figure className="flex flex-col items-center">
                <div className="flex aspect-square animate-pulse items-center justify-center rounded-full bg-amber-500/5 p-6">
                  <div className="flex aspect-square items-center justify-center rounded-full bg-amber-500/10 p-6">
                    <div className="aspect-square h-6 w-6 rounded-full bg-amber-500" />
                  </div>
                </div>
              </figure>
              <h1 className="text-5xl font-extrabold sm:text-6xl md:text-7xl">
                Aguardando jogadores
              </h1>
              <span className="!leading-relaxed dark:text-zinc-500 md:text-xl">
                Tua quantidade de acertos foi tão impressionante quanto a
                experiência de um cego em um tiroteio.
              </span>
            </header>

            <div className="flex items-center space-x-4">
              {mockPlayers.map((player, idx) => (
                <LobbyPlayerAvatar key={idx} player={player} isReady={idx === 4} />
              ))}
            </div>

            <Button size="lg" onClick={() => setGameStatus('IN_PROGRESS')}>Estou pronto!</Button>

            {/* BLOB */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full dark:bg-amber-500/20 blur-[320px]"></div>
          </section>
        ) : (
          <>
            <GameRankingSidebar />
            <div className="flex flex-1 flex-col items-center justify-between p-8">
              <BlackCard
                data={{
                  packId: 'snowflakes',
                  pick: 2,
                  text: 'Algo bem pesado que não se pode mostrar.'
                }}
              />
              <GamePlayerDeck />
            </div>
          </>
        )}
      </main>

      {/**
       * TODO: Game bottom bar
       *
       * - [ ] Leave room button
       * - [ ] Toggle sound button
       * - [ ] Toggle dark mode button
       * - [ ] Toggle fullscreen button
       *
       */}

      {/**
       * TODO: Judge Pick Modal
       *
       */}
    </div>
  );
}
