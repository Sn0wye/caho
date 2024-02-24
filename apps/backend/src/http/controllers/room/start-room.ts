import { startRoom } from '@caho/contracts';
import { type App } from '@/app';
import { validateSession } from '@/auth/lucia';
import { ROOM_ERRORS } from '@/errors/room';
import { RedisRoomRepository } from '@/repositories/room';
import { RoomService } from '@/services/RoomService';

export const startRoomController = async (app: App) => {
  const roomService = new RoomService(new RedisRoomRepository(app.redis));

  app.post('/start', async (req, res) => {
    const { user } = await validateSession(req, res);
    try {
      const { roomCode } = startRoom.parse(req.body);
      const { hostId } = await roomService.getRoom(roomCode);

      if (user.id !== hostId) {
        return res.badRequest(ROOM_ERRORS.IS_NOT_ROOM_HOST);
      }

      await roomService.startRoom(roomCode);
      res.status(204);
    } catch (e) {
      res.status(400);
      return e;
    }
  });
};
