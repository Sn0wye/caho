'use client';

import type { ListPublicRoomsResponse } from '@caho/contracts';
import { useQuery } from '@tanstack/react-query';
import { getPublicRooms } from '../get-public-rooms';
import { PublicGameRoomCard } from './public-game-room-card';

type PublicRoomsProps = {
  initialData: ListPublicRoomsResponse;
};

export const PublicRooms = ({ initialData }: PublicRoomsProps) => {
  const { data } = useQuery({
    queryKey: ['public-rooms'],
    queryFn: getPublicRooms,
    initialData,
    refetchInterval: 5000
  });

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {data?.map(room => (
        <PublicGameRoomCard key={room.id} {...room} />
      ))}
    </section>
  );
};
