import { redirect } from 'next/navigation';
import { type Room as RoomType } from '@caho/schemas';
import { currentUser } from '@clerk/nextjs';
import { api } from '@/utils/api';
import { Game } from './game';

type GamePageProps = {
  params: {
    roomCode: string;
  };
};

const getRoom = async (roomCode: string) => {
  const { data } = await api.get<RoomType>(`/rooms/${roomCode}`);

  return data;
};

export default async function GamePage({ params }: GamePageProps) {
  const room = await getRoom(params.roomCode);

  if (!room) {
    redirect('/dashboard');
  }

  const user = await currentUser();

  const userIsInRoom = room.players.some(player => player.id === user?.id);

  if (!userIsInRoom) {
    //TODO: verify connection, etc
    redirect('/dashboard');
  }

  return <Game {...room} />;
}
