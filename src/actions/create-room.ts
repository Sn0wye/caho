'use server';

import { zact } from 'zact/server';
import { redis } from '@/server/redis';
import { createRoomSchema } from '@/server/schemas/room';
import { createRoom } from '@/server/services/room';

export const createRoomAction = zact(createRoomSchema)(async input => {
  const game = await createRoom({ redis: redis, room: input });

  return {
    redirect: `/game/${game.id}`,
    game
  };
});
