import { joinRoom } from '@caho/contracts';
import { type Player } from '@caho/schemas';
import { type App } from '@/app';
import { validateSession } from '@/auth/lucia';
import { RedisRoomRepository } from '@/repositories/room';
import { RoomService } from '@/services/RoomService';

export const joinRoomController = async (app: App) => {
  const roomService = new RoomService(new RedisRoomRepository(app.redis));

  app.post('/join', async (req, res) => {
    const session = await validateSession(req, res);
    try {
      const validatedBody = joinRoom.parse(req.body);

      const player: Player = {
        id: session.user.id,
        isHost: false,
        score: 0,
        username: session.user.username,
        avatarUrl: session.user.avatarUrl,
        isReady: false,
        isJudge: false,
        cards: []
      };

      const room = await roomService.joinRoom({
        ...validatedBody,
        player,
        password: validatedBody.password
      });
      return room;
    } catch (e) {
      res.status(400);
      return e;
    }
  });
};
