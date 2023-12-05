import { redirect } from 'next/navigation';
import { type Player, type Room as RoomType } from '@caho/schemas';
import { api } from '@/utils/api';
import { getUser } from '@/auth';
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

const getRoomPlayers = async (roomCode: string) => {
  const { data } = await api.get<Player[]>(`/rooms/${roomCode}/players`);

  return data;
};
export default async function GamePage({ params }: GamePageProps) {
  const room = await getRoom(params.roomCode);

  if (!room) {
    redirect('/dashboard');
  }

  const user = await getUser();
  const roomPlayers = await getRoomPlayers(params.roomCode);

  const userIsInRoom = roomPlayers.some(player => player.id === user?.id);

  if (!userIsInRoom) {
    //TODO: verify connection, etc
    redirect('/dashboard');
  }

  return <Game {...room} />;
}
