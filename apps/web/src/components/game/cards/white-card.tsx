import type { WhiteCard as WhiteCardType } from '@caho/schemas';
import { cn } from '@/utils/cn';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-header';

type WhiteCardProps = {
  data: WhiteCardType;
  className?: string;
};

export function WhiteCard({ data, className }: WhiteCardProps) {
  const { packId, text } = data;

  return (
    <div
      className={cn(
        'flex aspect-card h-72 flex-col justify-between gap-2 rounded-xl border border-zinc-950 bg-zinc-50 p-5 transition-all hover:scale-110 dark:border-zinc-50',
        className
      )}
    >
      <CardHeader packId={packId} variant="whiteCard" size="sm" />

      <div className="flex-1">
        <span className="text-xl font-bold text-zinc-950">{text}</span>
      </div>

      <CardFooter variant="whiteCard" />
    </div>
  );
}
