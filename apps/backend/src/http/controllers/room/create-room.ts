import { createRoom } from '@caho/contracts';
import { type Player } from '@caho/schemas';
import { type App } from '@/app';
import { validateSession } from '@/auth/lucia';
import { RedisRoomRepository } from '@/repositories/room';
import { RoomService } from '@/services/RoomService';

export const createRoomController = async (app: App) => {
  const roomService = new RoomService(new RedisRoomRepository(app.redis));

  app.post('/create', async (req, res) => {
    const session = await validateSession(req, res);

    if (!session) {
      return res.unauthorized();
    }

    try {
      const validatedBody = createRoom.parse(req.body);

      const host: Player = {
        ...session.user,
        isHost: true,
        score: 0,
        isReady: false,
        isJudge: false,
        cards: []
      };

      const room = await roomService.createRoom({
        ...validatedBody,
        hostId: host.id
      });

      // await roomService.addPlayerToRoom({
      //   roomCode: room.code,
      //   player: host
      // });

      res.status(201);
      return room;
    } catch (e) {
      res.status(400);
      return e;
    }
  });
};
