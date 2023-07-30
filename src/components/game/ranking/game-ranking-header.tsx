import { cn } from '@/utils/cn';
import { GameRankingCollapseButton } from './game-ranking-collapse-button';
import { useGameRankingSidebarContext } from './game-ranking-sidebar';

export function GameRankingHeader() {
  const { isCollapsed } = useGameRankingSidebarContext();

  return (
    <header
      className={cn(
        'absolute left-0 top-0 z-20 flex w-full items-center bg-gradient-to-b from-zinc-50 via-zinc-50 to-transparent p-8 pb-16 dark:from-zinc-950 dark:via-zinc-950',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}
    >
      {!isCollapsed && (
        <h2 className="text-3xl font-bold !leading-none">Ranking</h2>
      )}
      <GameRankingCollapseButton />
    </header>
  );
}
