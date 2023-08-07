'use client';

import { type ComponentProps } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useGameRankingSidebarContext } from './game-ranking-sidebar';

type GameRankingCollapseButtonProps = ComponentProps<'button'>;

export function GameRankingCollapseButton(
  props: GameRankingCollapseButtonProps
) {
  const { isCollapsed, setIsCollapsed } = useGameRankingSidebarContext();

  function handleClick() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <button
      className="pointer-events-auto flex h-fit w-fit items-center justify-center rounded p-1.5 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-400"
      onClick={handleClick}
      {...props}
    >
      {isCollapsed ? (
        <PanelLeftOpen size={20} strokeWidth={1.75} />
      ) : (
        <PanelLeftClose size={20} strokeWidth={1.75} />
      )}
    </button>
  );
}
