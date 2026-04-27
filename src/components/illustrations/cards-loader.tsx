import { LogoSingleCard } from './logo-single-card';

interface CardsLoaderProps {}

export function CardsLoader({}: CardsLoaderProps) {
  return (
    <div className="flex animate-pulse -space-x-2 opacity-75">
      <LogoSingleCard variant="blackCard" className="-rotate-30" />
      <LogoSingleCard variant="whiteCard" className="rotate-30" />
    </div>
  );
}
