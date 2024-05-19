import type { App } from '@/app';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';
import { z } from 'zod';

export const getRoomController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

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
      const { password, ...sanitizedRoom } =
        await roomService.getRoom(roomCode);
      return sanitizedRoom;
    }
  );
};
