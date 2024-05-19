import type { App } from '@/app';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';
import { createRoom } from '@caho/contracts';
import type { Player } from '@caho/schemas';

export const createRoomController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

  app.post('/create', async (req, res) => {
    const { session, user } = req;

    if (!user || !session) {
      return res.unauthorized();
    }

    const validatedBody = createRoom.parse(req.body);

    const host: Player = {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      isHost: true,
      score: 0,
      isReady: false,
      isJudge: false
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
  });
};
