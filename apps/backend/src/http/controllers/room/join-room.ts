import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { joinRoomRequest } from '@caho/contracts';
import type { Player } from '@caho/schemas';

export const joinRoomController = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).post(
    '/join',
    {
      schema: {
        tags: ['Rooms'],
        description: 'Join a room',
        body: joinRoomRequest,
        security: [{ cookieAuth: [], bearerAuth: [] }]
      }
    },
    async req => {
      const user = req.getUser();
      const { roomCode, password } = req.body;

      const player: Player = {
        id: user.id,
        score: 0,
        username: user.username,
        avatarUrl: user.avatarUrl,
        isReady: false,
        isHost: false,
        isJudge: false,
        cardIds: []
      };

      const room = await roomService.joinRoom({
        roomCode,
        password,
        player
      });

      app.pubsub.publish(roomCode, {
        event: 'room.player-joined',
        payload: player
      });

      return room;
    }
  );
};
