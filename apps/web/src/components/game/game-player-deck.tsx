import { WhiteCard } from './cards/white-card';

interface GamePlayerDeckProps {}

export function GamePlayerDeck({}: GamePlayerDeckProps) {
  // TODO: -space-x-10 group hover:space-x-8 stack arc */

  return (
    <div className="flex w-full items-center justify-center space-x-4">
      <WhiteCard
        data={{
          packId: 'snowflakes',
          text: 'Carta branca 1'
        }}
      />

      <WhiteCard
        data={{
          packId: 'snowflakes',
          text: 'Carta branca 2'
        }}
      />

      <WhiteCard
        data={{
          packId: 'snowflakes',
          text: 'Carta branca 3'
        }}
      />
    </div>
  );
}
