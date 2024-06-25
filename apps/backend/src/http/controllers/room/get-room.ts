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
        params: z.object({
          roomCode: z.string().min(6).max(6)
        }),
        security: [{ cookieAuth: [] }]
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
