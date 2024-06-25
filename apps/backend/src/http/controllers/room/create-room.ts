import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { createRoom } from '@caho/contracts';
import type { Player } from '@caho/schemas';

export const createRoomController = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).post(
    '/create',
    {
      schema: { security: [{ cookieAuth: [] }] }
    },
    async (req, res) => {
      const user = req.getUser();

      const validatedBody = createRoom.parse(req.body);

      const host: Player = {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        score: 0,
        isReady: false,
        isHost: true,
        isJudge: false,
        cardIds: []
      };

      const room = await roomService.createRoom({
        ...validatedBody,
        hostId: host.id
      });

      await roomService.addPlayerToRoom({
        roomCode: room.code,
        player: host
      });

      res.status(201);
      return room;
    }
  );
};
