'use client';

import { useRef, type PointerEvent } from 'react';
import { cn } from '@/utils/cn';
import type { WhiteCard as WhiteCardType } from '@/schemas';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-header';

type WhiteCardProps = {
  data: WhiteCardType;
  onClick?: (card: WhiteCardType) => void;
  disabled?: boolean;
  // Mouse/pen only: whether the pointer rests on the card.
  onHoverChange?: (isHovered: boolean) => void;
  className?: string;
};

export function WhiteCard({
  data,
  onClick,
  disabled = false,
  onHoverChange,
  className
}: WhiteCardProps) {
  const { packId, text } = data;
  const isInteractive = !!onClick && !disabled;
  const isHovered = useRef(false);

  const setHovered = (event: PointerEvent, hovered: boolean) => {
    if (event.pointerType === 'touch' || isHovered.current === hovered) return;
    isHovered.current = hovered;
    onHoverChange?.(hovered);
  };

  return (
    <button
      type="button"
      disabled={disabled || !onClick}
      onClick={() => onClick?.(data)}
      // Move too, not just enter: a card dealt under a resting pointer gets no
      // pointerenter until the pointer leaves and comes back.
      onPointerEnter={event => setHovered(event, true)}
      onPointerMove={event => setHovered(event, true)}
      onPointerLeave={event => setHovered(event, false)}
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
