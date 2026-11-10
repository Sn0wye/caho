'use client';

import { createContext, useContext } from 'react';
import { cn } from '@/utils/cn';
import type { BlackCard as BlackCardType, WhiteCard } from '@/schemas';
import { BlackCard } from '../cards/black-card';

// A card on the felt the pointer rests on, shown upright and full size beside
// the table, like Tabletop Simulator's hover zoom. Local to this screen: the
// table itself stays the same for everyone.
export type CardPreview = {
  card: BlackCardType | null;
  answers: WhiteCard[];
  // The side of the scene away from the pointer, so it never covers the card.
  side: 'left' | 'right';
};

type SetCardPreview = (preview: CardPreview | null) => void;

const CardPreviewContext = createContext<SetCardPreview>(() => {});

export const CardPreviewProvider = CardPreviewContext.Provider;

/**
 * Shows (or, with null, hides) the zoomed copy of a felt card. A no-op outside
 * the table layout.
 *
 * @example
 * const preview = useCardPreview();
 * <div onPointerEnter={e => preview({ card, answers, side: previewSide(e.clientX) })} />
 */
export function useCardPreview(): SetCardPreview {
  return useContext(CardPreviewContext);
}

/** The side for a preview, opposite the pointer at `clientX`. */
export function previewSide(clientX: number): CardPreview['side'] {
  return clientX < window.innerWidth / 2 ? 'right' : 'left';
}

export function CardPreviewLayer({ preview }: { preview: CardPreview | null }) {
  if (!preview) return null;

  return (
    <div
      data-testid="card-preview"
      className={cn(
        'animate-in fade-in zoom-in-95 pointer-events-none absolute top-6 z-30 duration-150',
        preview.side === 'left' ? 'left-6' : 'right-6'
      )}
    >
      <BlackCard
        card={preview.card}
        answers={preview.answers}
        className="shadow-[0_24px_48px_rgba(0,0,0,0.6)]"
      />
    </div>
  );
}
