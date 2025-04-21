'use client';

import type { WhiteCard as WhiteCardType } from '@caho/schemas';
import { cn } from '@/utils/cn';
import { useGame } from '@/hooks/game';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-header';

type WhiteCardProps = {
  data: WhiteCardType;
  className?: string;
};

export function WhiteCard({ data, className }: WhiteCardProps) {
  const { handlePickWhiteCard, isWhiteCardPickingDisabled } = useGame();
  const { packId, text } = data;

  return (
    <button
      type="button"
      disabled={isWhiteCardPickingDisabled}
      onClick={() => handlePickWhiteCard(data)}
      className={cn(
        'flex aspect-card h-72 flex-col justify-between gap-2 rounded-xl border-2 border-zinc-100 bg-white p-5 text-left shadow-xl transition-all disabled:cursor-not-allowed dark:border-zinc-50',
        !isWhiteCardPickingDisabled &&
          'hover:-translate-y-4 hover:scale-110 hover:cursor-pointer',
        className
      )}
    >
      <CardHeader packId={packId} variant="whiteCard" size="sm" />

      <div className="flex-1">
        <span className="text-xl font-bold text-zinc-950">{text}</span>
      </div>

      <CardFooter variant="whiteCard" />
    </button>
  );
}
