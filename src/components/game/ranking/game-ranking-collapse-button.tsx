'use client';

import { type ComponentProps } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

type GameRankingCollapseButtonProps = ComponentProps<'button'> & {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function GameRankingCollapseButton({
  setIsOpen,
  isOpen,
  ...props
}: GameRankingCollapseButtonProps) {
  return (
    <button
      className="flex h-fit w-fit items-center justify-center rounded p-1.5 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-400"
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {isOpen ? (
        <PanelLeftClose size={20} strokeWidth={1.75} />
      ) : (
        <PanelLeftOpen size={20} strokeWidth={1.75} />
      )}
    </button>
  );
}
