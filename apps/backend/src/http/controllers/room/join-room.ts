import type { App } from '@/app';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';
import { joinRoom } from '@caho/contracts';
import type { Player } from '@caho/schemas';

export const joinRoomController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

  app.post(
    '/join',
    {
      schema: {
        body: joinRoom
      }
    },
    async (req, res) => {
      if (!req.session || !req.user) {
        return res.unauthorized();
      }

      const user = req.user;
      const { roomCode, password } = req.body;

      const player: Player = {
        id: user.id,
        isHost: false,
        score: 0,
        username: user.username,
        avatarUrl: user.avatarUrl,
        isReady: false,
        isJudge: false
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
