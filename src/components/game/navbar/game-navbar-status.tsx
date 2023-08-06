import { type RoomStatus } from '@/server/schemas/room';
import { cn } from '@/utils/cn';

type GameStatusVariantsObject = {
  [key in RoomStatus]: string;
}

const gameStatusColorVariants: GameStatusVariantsObject = {
  'LOBBY': 'bg-amber-500',
  'IN_PROGRESS': 'bg-green-500',
  'FINISHED': 'bg-red-500'
};

const gameStatusLabelVariants: GameStatusVariantsObject = {
  'LOBBY': 'LOBBY',
  'IN_PROGRESS': 'EM PROGRESSO',
  'FINISHED': 'FINALIZADO'
};

type GameNavbarStatusProps = {
  gameStatus: RoomStatus;
};

export function GameNavbarStatus({ gameStatus }: GameNavbarStatusProps) {
  return (
    <span
      className={cn(
        'w-fit px-2 py-1 font-mono font-bold uppercase !leading-none text-zinc-100',
        gameStatusColorVariants[gameStatus]
      )}
    >
      {gameStatusLabelVariants[gameStatus]}
    </span>
  );
}
