import type { App } from '@/app';
import { ROOM_ERRORS } from '@/errors/room';
import { ensureAuth } from '@/plugins/ensure-auth';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { endRoom } from '@caho/contracts';

export const endRoomController = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).post(
    '/end',
    {
      schema: { security: [{ cookieAuth: [] }] }
    },
    async (req, res) => {
      const user = req.getUser();

      const { roomCode } = endRoom.parse(req.body);
      const { hostId } = await roomService.getRoom(roomCode);
      const isAdmin = user.id === hostId;

      if (!isAdmin) {
        return res.badRequest(ROOM_ERRORS.IS_NOT_ROOM_HOST);
      }

      const room = await roomService.endRoom(roomCode);
      return room;
    }
  );
};
