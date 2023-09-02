import { type BlackCard } from 'types';
import { CardFooter } from './card-footer';
import { CardHeader } from './card-header';

type BlackCardProps = {
  data: BlackCard;
};

export function BlackCard({ data }: BlackCardProps) {
  const { packId, text } = data;

  // TODO: Handle pick (Fill in the blanks)

  return (
    <div className="flex aspect-card h-[30rem] flex-col justify-between gap-5 rounded-2xl border border-zinc-950 bg-zinc-950 p-9 dark:border-zinc-50">
      <CardHeader packId={packId} variant="blackCard" />

      <div className="flex-1">
        <span className="text-4xl font-bold leading-snug text-zinc-50">
          {text}
        </span>
      </div>

      <CardFooter variant="blackCard" size="lg" />
    </div>
  );
}
