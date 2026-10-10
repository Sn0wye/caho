'use client';

import { cn } from '@/utils/cn';
import type { WhiteCard as WhiteCardType } from '@/schemas';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-header';

type WhiteCardProps = {
  data: WhiteCardType;
  onClick?: (card: WhiteCardType) => void;
  disabled?: boolean;
  className?: string;
};

export function WhiteCard({
  data,
  onClick,
  disabled = false,
  className
}: WhiteCardProps) {
  const { packId, text } = data;
  const isInteractive = !!onClick && !disabled;

  return (
    <button
      type="button"
      disabled={disabled || !onClick}
      onClick={() => onClick?.(data)}
      className={cn(
        'aspect-card flex h-72 shrink-0 snap-center flex-col justify-between gap-2 rounded-xl border-2 border-zinc-100 bg-white p-5 text-left shadow-xl transition-all disabled:cursor-not-allowed dark:border-zinc-50',
        isInteractive &&
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
