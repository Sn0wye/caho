import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';
import { leaveRoom } from '@caho/contracts';

export const leaveRoomController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

  app.register(ensureAuth).post(
    '/leave',
    {
      schema: { security: [{ cookieAuth: [] }] }
    },
    async (req, res) => {
      const user = req.getUser();

      const { roomCode } = leaveRoom.parse(req.body);
      await roomService.leaveRoom({
        roomCode,
        playerId: user.id
      });
      return res.status(204);
    }
  );
};
