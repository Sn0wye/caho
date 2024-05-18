import { joinRoom } from '@caho/contracts';
import { type Player } from '@caho/schemas';
import { type App } from '@/app';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';

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

      try {
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
      } catch (e) {
        res.status(400);
        return e;
      }
    }
  );
};