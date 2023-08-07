'use client';

import { type ReactNode } from 'react';
import { LiveObject } from '@liveblocks/client';
import { ClientSideSuspense } from '@liveblocks/react';
import { RoomProvider } from 'liveblocks.config';
import { type Room } from '@/server/schemas/room';

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
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
