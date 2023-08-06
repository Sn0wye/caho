'use client';

import { useStorage } from 'liveblocks.config';
import { BlackCard } from '@/components/game/cards/black-card';
import { GamePlayerDeck } from '@/components/game/game-player-deck';
import { Lobby } from '@/components/game/lobby/lobby';
import { GameNavbar } from '@/components/game/navbar/game-navbar';
import { GameRankingSidebar } from '@/components/game/ranking/game-ranking-sidebar';
import { type Room } from '@/server/schemas/room';

type GameProps = Room;

export const Game = ({ status }: GameProps) => {
  const room = useStorage(s => s.room);

  console.log('room storage data', room);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-between">
      <GameNavbar gameStatus={status} />

      <main className="flex h-[calc(100vh-4rem)] w-full flex-1">
        {status === 'LOBBY' && <Lobby />}

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
      </main>

      {/**
       * //TODO: Game bottom bar
       *
       * - [ ] Leave room button
       * - [ ] Toggle sound button
       * - [ ] Toggle dark mode button
       * - [ ] Toggle fullscreen button
       *
       */}
    </div>
  );
};
