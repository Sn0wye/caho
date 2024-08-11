import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { z } from 'zod';

export const playerReadyController = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).post(
    '/:roomCode/ready',
    {
      schema: {
        tags: ['Rooms'],
        description: 'Toggle player ready status',
        params: z.object({
          roomCode: z.string().min(6).max(6)
        }),
        security: [{ cookieAuth: [], bearerAuth: [] }]
      }
    },
    async req => {
      const userId = req.getUser().id;
      const { roomCode } = req.params;

      const player = await roomService.getPlayerFromRoom(roomCode, userId);

      await roomService.updatePlayerInRoom(roomCode, userId, {
        isReady: !player.isReady
      });
      player.isReady = !player.isReady;

      await app.pubsub.publish(roomCode, {
        event: 'room.player-update',
        payload: player
      });
    }
  );
};
