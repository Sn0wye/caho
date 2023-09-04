'use client';

import { type Room } from '@caho/schemas';
import { GameNavbar } from '@/components/game/navbar/game-navbar';
import { Ongoing } from '@/components/game/ongoing/ongoing';

type GameProps = Room;

export const Game = ({ status }: GameProps) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-between">
      <GameNavbar gameStatus={status} />

      {/* {status === 'LOBBY' && <Lobby />} */}
      {status === 'LOBBY' && <Ongoing />}

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
