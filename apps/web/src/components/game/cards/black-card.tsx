'use client';

import { useMemo } from 'react';
import { useGame } from '@/hooks/game';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-header';

export function BlackCard() {
  const { currentBlackCard } = useGame();
  // Determine text size class based on character count
  const textSizeClass = useMemo(() => {
    const text = currentBlackCard?.text || '';
    const charCount = text.length;

    // Text size thresholds based on character count
    if (charCount <= 74) return 'text-4xl'; // Up to 74 chars
    if (charCount <= 100) return 'text-3xl'; // Up to 100 chars
    if (charCount <= 150) return 'text-2xl'; // Up to 150 chars
    if (charCount <= 200) return 'text-xl'; // Up to 200 chars
    return 'text-lg'; // More than 200 chars
  }, [currentBlackCard?.text]);

  // Process text to replace "___" with styled lines
  const processedContent = useMemo(() => {
    const text = currentBlackCard?.text || '';

    // If no fill-in-the-gap markers, return the text as is
    if (!text.includes('___')) return text;

    // Split by the fill-in-the-gap marker
    const segments = text.split('___');

    // Map through segments and join with styled lines
    return segments.map((segment, index) => {
      // Last segment doesn't need a line after it
      if (index === segments.length - 1) {
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        return <span key={index}>{segment}</span>;
      }

      // Add a line after each segment (except the last)
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <span key={index}>
          {segment}
          <span className="mx-1 inline-block h-4 w-24 border-b-2 border-zinc-50 align-middle" />
        </span>
      );
    });
  }, [currentBlackCard?.text]);

  return (
    <div className="flex aspect-card h-[30rem] flex-col justify-between gap-5 rounded-2xl border border-zinc-950 bg-zinc-950 p-9 dark:border-zinc-50">
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
