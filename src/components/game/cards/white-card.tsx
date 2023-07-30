import { type WhiteCard } from 'types';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-header';

type WhiteCardProps = {
  data: WhiteCard;
};

export function WhiteCard({ data }: WhiteCardProps) {
  const { packId, text } = data;

  return (
    <div className="flex aspect-card h-72 flex-col justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition-all hover:scale-110 dark:border-zinc-50">
      <CardHeader packId={packId} variant="whiteCard" size="sm" />

      <div className="flex-1">
        <span className="text-xl font-bold text-zinc-950">{text}</span>
      </div>

      <CardFooter size="sm" variant="whiteCard" />
    </div>
  );
}
