import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import { createCaller } from '@/utils/caller';
import { Game } from './game';
import { Room } from './room';

type GamePageProps = {
  params: {
    roomCode: string;
  };
};

export default async function GamePage({ params }: GamePageProps) {
  const caller = createCaller();
  const room = await caller.room.get({
    roomCode: params.roomCode
  });

  const user = await currentUser();

  const userIsInRoom = room.players.some(player => player.id === user?.id);

  if (!userIsInRoom) {
    //TODO: verify connection, etc
    redirect('/dashboard');
  }

  return (
    <Room room={room}>
      <Game {...room} />
    </Room>
  );
}
