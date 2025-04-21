'use client';

import { useMemo } from 'react';
import { useGame } from '@/hooks/game';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-header';

export function BlackCard() {
  const { currentBlackCard, selectedWhiteCards, handleUnpickWhiteCard } =
    useGame();

  const combinedTextLength = useMemo(() => {
    if (!currentBlackCard?.text) return 0;

    const blackCardText = currentBlackCard.text;
    const whiteCardsText =
      selectedWhiteCards?.map(card => card.text).join('') || '';

    return blackCardText.length + whiteCardsText.length;
  }, [currentBlackCard?.text, selectedWhiteCards]);

  const textSizeClass = useMemo(() => {
    if (combinedTextLength <= 50) return 'text-3xl';
    if (combinedTextLength <= 70) return 'text-2xl';
    if (combinedTextLength <= 100) return 'text-xl';
    if (combinedTextLength <= 150) return 'text-lg';
    return 'text-base';
  }, [combinedTextLength]);

  const processedContent = useMemo(() => {
    const text = currentBlackCard?.text || '';
    if (!text.includes('___')) return text;

    const segments = text.split('___');
    const whiteCards = selectedWhiteCards || [];

    return segments.map((segment, index) => {
      if (index === segments.length - 1) {
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        return <span key={`segment-${index}`}>{segment}</span>;
      }

      const hasWhiteCard = index < whiteCards.length;

      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <span key={`segment-${index}`}>
          {segment}
          {hasWhiteCard ? (
            <button
              type="button"
              onClick={() => handleUnpickWhiteCard(whiteCards[index])}
              className="my-1 inline-block rounded bg-white px-2 py-1 text-left font-bold text-zinc-950"
            >
              {whiteCards[index].text}
            </button>
          ) : (
            // Display empty blank
            <span className="mx-1 inline-block h-4 w-24 border-b-2 border-white align-middle" />
          )}
        </span>
      );
    });
  }, [currentBlackCard?.text, selectedWhiteCards, handleUnpickWhiteCard]);

  return (
    <div className="flex aspect-card h-96 flex-col justify-between gap-2 rounded-2xl border border-zinc-950 bg-zinc-950 p-6 dark:border-zinc-50">
      <CardHeader packId={currentBlackCard?.packId || ''} variant="blackCard" />

      <div className="flex flex-1 items-center">
        <span
          className={`${textSizeClass} font-bold leading-snug text-zinc-50`}
        >
          {processedContent}
        </span>
      </div>

      <CardFooter variant="blackCard" size="lg" />
    </div>
  );
}
