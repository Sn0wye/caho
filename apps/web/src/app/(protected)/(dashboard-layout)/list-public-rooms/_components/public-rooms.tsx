'use client';

import type { Room } from '@caho/schemas';
import { useQuery } from '@tanstack/react-query';
import { getPublicRooms } from '../getPublicRooms';
import { PublicGameRoomCard } from './public-game-room-card';

type PublicRoomsProps = {
  initialData: Room[];
};

export const PublicRooms = ({ initialData }: PublicRoomsProps) => {
  const { data } = useQuery({
    queryKey: ['public-rooms'],
    queryFn: getPublicRooms,
    initialData
  });

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {data?.map(room => (
        <PublicGameRoomCard key={room.id} {...room} />
      ))}
    </section>
  );
};
