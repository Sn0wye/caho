import { GameRankingCollapseButton } from './game-ranking-collapse-button';

export function GameRankingHeader() {
  return (
    <header className="absolute left-0 top-0 z-10 flex w-full items-center justify-between bg-gradient-to-b from-zinc-50 via-zinc-50 to-transparent p-8 pb-16 dark:from-zinc-950 dark:via-zinc-950">
      <h2 className="text-3xl font-bold">Ranking</h2>
      <GameRankingCollapseButton />
    </header>
  );
}
