'use client';

import { useMemo, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import type { BlackCard as BlackCardType, WhiteCard } from '@/schemas';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-header';

const BLANK = '___';

const blackCardVariants = cva(
  'flex aspect-card shrink-0 flex-col justify-between gap-2 border border-zinc-950 bg-zinc-950 dark:border-zinc-50',
  {
    variants: {
      size: {
        lg: 'h-96 rounded-2xl p-6',
        sm: 'h-72 rounded-xl p-5'
      }
    },
    defaultVariants: {
      size: 'lg'
    }
  }
);

type BlackCardProps = VariantProps<typeof blackCardVariants> & {
  card: BlackCardType | null;
  // White Cards filling the blanks, in answer order.
  answers?: WhiteCard[];
  // Makes each filled-in answer clickable (e.g. to take it back to the Hand).
  onAnswerClick?: (card: WhiteCard) => void;
  className?: string;
};

export function BlackCard({
  card,
  answers = [],
  onAnswerClick,
  size,
  className
}: BlackCardProps) {
  const text = card?.text ?? '';

  const textSizeClass = useMemo(() => {
    const length = text.length + answers.map(a => a.text).join('').length;
    const scale =
      size === 'sm'
        ? ['text-xl', 'text-lg', 'text-base', 'text-sm', 'text-xs']
        : ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base'];

    if (length <= 50) return scale[0];
    if (length <= 70) return scale[1];
    if (length <= 100) return scale[2];
    if (length <= 150) return scale[3];
    return scale[4];
  }, [text, answers, size]);

  const renderAnswer = (answer: WhiteCard, key: string): ReactNode => {
    const className =
      'my-1 inline rounded-sm bg-white px-2 py-1 text-left font-bold text-zinc-950 box-decoration-clone';

    // A plain span when read-only, so the card can sit inside a clickable
    // wrapper (judging) without nesting buttons.
    if (!onAnswerClick) {
      return (
        <span key={key} className={className}>
          {answer.text}
        </span>
      );
    }

    return (
      <button
        key={key}
        type="button"
        onClick={() => onAnswerClick(answer)}
        className={cn(className, 'cursor-pointer hover:bg-zinc-200')}
      >
        {answer.text}
      </button>
    );
  };

  const content = useMemo(() => {
    // Cards without a blank are questions: the answers follow the text.
    if (!text.includes(BLANK)) {
      return (
        <>
          <span>{text}</span>
          {answers.map((answer, index) => (
            <span key={answer.id} className="block">
              {renderAnswer(answer, `answer-${index}`)}
            </span>
          ))}
        </>
      );
    }

    const segments = text.split(BLANK);

    return segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      const answer = answers[index];

      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: segments have no stable id
        <span key={`segment-${index}`}>
          {segment}
          {!isLast &&
            (answer ? (
              renderAnswer(answer, `answer-${index}`)
            ) : (
              <span className="mx-1 inline-block h-4 w-24 border-b-2 border-white align-middle" />
            ))}
        </span>
      );
    });
    // renderAnswer only closes over onAnswerClick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, answers, onAnswerClick]);

  return (
    <div className={cn(blackCardVariants({ size }), className)}>
      <CardHeader packId={card?.packId || ''} variant="blackCard" />

      <div className="flex flex-1 items-center overflow-hidden">
        <span
          className={cn(textSizeClass, 'leading-snug font-bold text-zinc-50')}
        >
          {content}
        </span>
      </div>

      <CardFooter variant="blackCard" size={size === 'sm' ? 'default' : 'lg'} />
    </div>
  );
}
