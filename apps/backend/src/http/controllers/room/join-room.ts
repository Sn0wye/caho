import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';
import { joinRoom } from '@caho/contracts';
import type { Player } from '@caho/schemas';

export const joinRoomController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

  app.register(ensureAuth).post(
    '/join',
    {
      schema: {
        body: joinRoom,
        security: [{ cookieAuth: [] }]
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
        event: 'player-joined',
        payload: player
      });

      return room;
    }
  );
};
