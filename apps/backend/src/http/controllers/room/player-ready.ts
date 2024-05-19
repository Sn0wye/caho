import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';
import { z } from 'zod';

export const playerReadyController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

  app.register(ensureAuth).post(
    '/:roomCode/ready',
    {
      schema: {
        params: z.object({
          roomCode: z.string().min(6).max(6)
        }),
        security: [{ cookieAuth: [] }]
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
        event: 'player-update',
        payload: player
      });
    }
  );
};
