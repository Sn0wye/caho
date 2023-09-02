import { Badge, type BadgeVariants } from '@/components/ui/badge';
import { type RoomStatus } from '@/server/schemas/room';

const gameStatusColorVariants: {
  [key in RoomStatus]: BadgeVariants['variant'];
} = {
  'LOBBY': 'orange',
  'IN_PROGRESS': 'outline',
  'FINISHED': 'destructive'
};

const gameStatusLabelVariants: { [key in RoomStatus]: string } = {
  'LOBBY': 'Lobby',
  'IN_PROGRESS': 'Em andamento',
  'FINISHED': 'Finalizado'
};

type GameNavbarStatusProps = {
  gameStatus: RoomStatus;
};

export function GameNavbarStatus({ gameStatus }: GameNavbarStatusProps) {
  return (
    <Badge variant={gameStatusColorVariants[gameStatus]} className="uppercase">
      {gameStatusLabelVariants[gameStatus]}
    </Badge>
  );
}
