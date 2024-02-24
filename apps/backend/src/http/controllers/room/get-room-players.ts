import { z } from 'zod';
import { type App } from '@/app';
import { RedisRoomRepository } from '@/repositories/room';
import { RoomService } from '@/services/RoomService';

export const getRoomPlayersController = async (app: App) => {
  const roomService = new RoomService(new RedisRoomRepository(app.redis));

  app.get(
    '/:roomCode/players',
    {
      schema: {
        params: z.object({
          roomCode: z.string().min(6).max(6)
        })
      }
    },
    async (req, _res) => {
      const { roomCode } = req.params;
      const players = await roomService.getRoomPlayers(roomCode);
      return players;
    }
  );
};
