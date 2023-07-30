import { BlackCard } from '@/components/game/cards/black-card';
import { GamePlayerDeck } from '@/components/game/game-player-deck';
import { GameNavbar } from '@/components/game/navbar/game-navbar';
import { GameRankingSidebar } from '@/components/game/ranking/game-ranking-sidebar';

export default async function GamePage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-between">
      <GameNavbar />

      <main className="flex h-[calc(100vh-4rem)] w-full flex-1">
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

      {/**
       * TODO: Judge Pick Modal
       *
       */}
    </div>
  );
}
