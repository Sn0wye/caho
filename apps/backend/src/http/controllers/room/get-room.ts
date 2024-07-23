import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { z } from 'zod';

export const getRoomController = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).get(
    '/:roomCode',
    {
      schema: {
        tags: ['Rooms'],
        description: 'Get a room',
        params: z.object({
          roomCode: z.string().min(6).max(6)
        }),
        security: [{ cookieAuth: [], bearerAuth: [] }]
      }
    },
    async req => {
      const { roomCode } = req.params;
      const { password, ...sanitizedRoom } = await roomService.getRoom(
        roomCode
      );
      return sanitizedRoom;
    }
  );
};
