import type { App } from '@/app';
import { ROOM_ERRORS } from '@/errors/room';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';
import { endRoom } from '@caho/contracts';

export const endRoomController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

  app.post('/end', async (req, res) => {
    const { user } = req;
    if (!user) {
      return res.unauthorized();
    }

    try {
      const { roomCode } = endRoom.parse(req.body);
      const { hostId } = await roomService.getRoom(roomCode);
      const isAdmin = user.id === hostId;

      if (!isAdmin) {
        return res.badRequest(ROOM_ERRORS.IS_NOT_ROOM_HOST);
      }

      const room = await roomService.endRoom(roomCode);
      return room;
    } catch (e) {
      res.status(400);
      return e;
    }
  });
};
