'use client';

import type { Player, Room } from '@caho/schemas';
import { GameNavbar } from '@/components/game/navbar/game-navbar';
import { Ongoing } from '@/components/game/ongoing/ongoing';

type GameProps = {
  room: Room;
  players: Player[];
  currentPlayer: Player;
};

export const Game = ({ room, players, currentPlayer }: GameProps) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-between">
      <GameNavbar roomCode={room.code} roomStatus={room.status} />

      {/* {room.status === 'LOBBY' && (
        <Lobby
          room={room}
          initialPlayers={players}
          initialCurrentPlayer={currentPlayer}
        />
      )} */}
      {room.status === 'LOBBY' && <Ongoing />}

      {/**
       * //TODO: Game bottom bar
       *
       * - [ ] Leave room button
       * - [ ] Toggle sound button
       * - [ ] Toggle fullscreen button
       *
       */}
    </div>
  );
};
