import { z } from 'zod';
import { type App } from '@/app';
import { HTTPError } from '@/errors/HTTPError';
import { RedisRoomRepository } from '@/repositories/room';
import { RoomService } from '@/services/RoomService';

export const getRoomController = async (app: App) => {
  const roomService = new RoomService(new RedisRoomRepository(app.redis));

  app.get(
    '/:roomCode',
    {
      schema: {
        params: z.object({
          roomCode: z.string().min(6).max(6)
        })
      }
    },
    async (req, res) => {
      if (!req.user || !req.session) {
        return res.unauthorized();
      }

      const { roomCode } = req.params;
      try {
        const room = await roomService.getRoom(roomCode);
        return room;
      } catch (e) {
        if (e instanceof HTTPError) {
          return e;
        }
      }
    }
  );
};
