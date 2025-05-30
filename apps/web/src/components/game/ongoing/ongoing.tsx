import { BlackCard } from '../cards/black-card';
import { GamePlayerDeck } from '../game-player-deck';
import { GameRankingSidebar } from '../ranking/game-ranking-sidebar';

export const Ongoing = () => {
  return (
    <main className="flex h-[calc(100vh-4rem)] w-full flex-1">
      <GameRankingSidebar />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center p-8">
          <BlackCard />
        </div>

        <GamePlayerDeck />
      </div>
    </main>
  );
};
