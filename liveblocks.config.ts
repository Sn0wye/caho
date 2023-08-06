/* eslint-disable @typescript-eslint/ban-types */

import { createClient, type LiveObject } from '@liveblocks/client';
import { createRoomContext } from '@liveblocks/react';
import { env } from '@/env.mjs';
import { type Room } from '@/server/schemas/room';

const client = createClient({
  publicApiKey: env.LIVEBLOCKS_PUBLIC_API_KEY
});

type Presence = {};
export type Storage = {
  room: LiveObject<Room>;
};
type UserMeta = {};
type RoomEvent = {};

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useObject,
    useMap,
    useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation
  }
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
