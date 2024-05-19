import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';
import { z } from 'zod';

export const getRoomPlayersController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

  app.register(ensureAuth).get(
    '/:roomCode/players',
    {
      schema: {
        params: z.object({
          roomCode: z.string().min(6).max(6)
        }),
        security: [{ cookieAuth: [] }]
      }
    },
    async (req, _res) => {
      const { roomCode } = req.params;
      const players = await roomService.getRoomPlayers(roomCode);
      return players;
    }
  );
};
