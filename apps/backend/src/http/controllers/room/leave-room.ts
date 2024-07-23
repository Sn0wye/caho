import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { leaveRoom } from '@caho/contracts';

export const leaveRoomController = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).post(
    '/leave',
    {
      schema: {
        tags: ['Rooms'],
        description: 'Leave a room',
        security: [{ cookieAuth: [], bearerAuth: [] }]
      }
    },
    async (req, res) => {
      const user = req.getUser();

      const { roomCode } = leaveRoom.parse(req.body);
      await roomService.leaveRoom({
        roomCode,
        playerId: user.id
      });

      await app.pubsub.publish(roomCode, {
        event: 'player-left',
        payload: {
          id: user.id
        }
      });

      return res.status(204);
    }
  );
};
