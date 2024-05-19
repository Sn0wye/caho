import { leaveRoom } from '@caho/contracts';
import type { App } from '@/app';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';

export const leaveRoomController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

  app.post('/leave', async (req, res) => {
    const { user } = req;

    if (!user) {
      return res.unauthorized();
    }

    try {
      const { roomCode } = leaveRoom.parse(req.body);
      await roomService.leaveRoom({
        roomCode,
        playerId: user.id
      });
      return res.status(204);
    } catch (e) {
      res.status(400);
      return e;
    }
  });
};
