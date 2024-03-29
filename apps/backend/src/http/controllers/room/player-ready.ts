import { z } from 'zod';
import { type App } from '@/app';
import { pubsub } from '@/lib/pub-sub';
import { RedisRoomRepository } from '@/repositories/room';
import { RoomService } from '@/services/RoomService';

export const playerReadyController = async (app: App) => {
  const roomService = new RoomService(new RedisRoomRepository(app.redis));

  app.post(
    '/:roomCode/ready',
    {
      schema: {
        params: z.object({
          roomCode: z.string().min(6).max(6)
        })
      }
    },
    async (req, res) => {
      if (!req.session || !req.user) {
        return res.unauthorized();
      }

      const { roomCode } = req.params;

      try {
        const player = await roomService.getPlayerFromRoom(
          roomCode,
          req.user.id
        );

        await roomService.updatePlayerInRoom(roomCode, req.user.id, {
          isReady: !player.isReady
        });
        player.isReady = !player.isReady;

        pubsub.publish(roomCode, {
          event: 'player-update',
          payload: player
        });
      } catch (e) {
        console.error(e);
        return e;
      }
    }
  );
};
