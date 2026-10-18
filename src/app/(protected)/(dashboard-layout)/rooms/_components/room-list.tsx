'use client';

import { useQuery } from '@tanstack/react-query';
import type { ListRoomsResponse } from '@/contracts';
import { getRooms } from '../get-rooms';
import { RoomListCard } from './room-list-card';

type RoomListProps = {
  initialData: ListRoomsResponse;
};

export const RoomList = ({ initialData }: RoomListProps) => {
  const { data } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
    initialData,
    refetchInterval: 5000
  });

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {data?.map(room => (
        <RoomListCard key={room.id} {...room} />
      ))}
    </section>
  );
};
