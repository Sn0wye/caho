'use client';

import { GameLoading } from '@/components/game/game-loading';
import { type Room } from '@/server/schemas/room';
import { LiveObject } from '@liveblocks/client';
import { ClientSideSuspense } from '@liveblocks/react';
import { RoomProvider } from 'liveblocks.config';
import { type ReactNode } from 'react';

type RoomProps = {
  children: ReactNode;
  room: Room;
};

export function Room({ children, room }: RoomProps) {
  return (
    <RoomProvider
      id={room.code}
      initialPresence={{}}
      initialStorage={{
        room: new LiveObject(room)
      }}
    >
      <ClientSideSuspense fallback={<GameLoading />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
