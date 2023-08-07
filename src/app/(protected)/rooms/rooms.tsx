'use client';

import { PublicGameRoomCard } from '@/components/public-game-room-card';
import { api, type RouterOutputs } from '@/utils/api';

type RoomsProps = {
  initialData: RouterOutputs['room']['list'];
};

export const Rooms = ({ initialData }: RoomsProps) => {
  const { data } = api.room.list.useQuery(undefined, {
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
