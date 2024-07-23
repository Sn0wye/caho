import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { z } from 'zod';

export const getRoomPlayersController = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).get(
    '/:roomCode/players',
    {
      schema: {
        tags: ['Rooms'],
        description: 'Get the players of a room',
        params: z.object({
          roomCode: z.string().min(6).max(6)
        }),
        security: [{ cookieAuth: [], bearerAuth: [] }]
      }
    },
    async (req, _res) => {
      const { roomCode } = req.params;
      const players = await roomService.getRoomPlayers(roomCode);
      return players;
    }
  );
};
