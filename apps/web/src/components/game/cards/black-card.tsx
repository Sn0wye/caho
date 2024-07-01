import { useGame } from '@/hooks/game';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-header';

export function BlackCard() {
  const { currentBlackCard } = useGame();
  // TODO:
  // - [ ] Handle pick (Fill in the blanks)
  // - [ ] Blank fill style

  return (
    <div className="flex aspect-card h-[30rem] flex-col justify-between gap-5 rounded-2xl border border-zinc-950 bg-zinc-950 p-9 dark:border-zinc-50">
      <CardHeader packId={currentBlackCard?.packId || ''} variant="blackCard" />

      <div className="flex-1">
        <span className="text-4xl font-bold leading-snug text-zinc-50">
          {currentBlackCard?.text || ''}
        </span>
      </div>

      <CardFooter variant="blackCard" size="lg" />
    </div>
  );
}
