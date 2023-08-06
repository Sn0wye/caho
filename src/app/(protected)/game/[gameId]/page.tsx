import { BlackCard } from '@/components/game/cards/black-card';
import { GamePlayerDeck } from '@/components/game/game-player-deck';
import { Lobby } from '@/components/game/lobby/lobby';
import { GameNavbar } from '@/components/game/navbar/game-navbar';
import { GameRankingSidebar } from '@/components/game/ranking/game-ranking-sidebar';
import { type RoomStatus } from '@/server/schemas/room';

const gameStatus: RoomStatus = 'IN_PROGRESS' as const;

export default async function GamePage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-between">
      <GameNavbar gameStatus={gameStatus} />

      <main className="flex h-[calc(100vh-4rem)] w-full flex-1">
        {gameStatus === 'LOBBY' && <Lobby />}

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
       * TODO: Game bottom bar
       *
       * - [ ] Leave room button
       * - [ ] Toggle sound button
       * - [ ] Toggle dark mode button
       * - [ ] Toggle fullscreen button
       *
       */}
    </div>
  );
}
