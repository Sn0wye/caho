import {
  createRoom,
  endRoom,
  joinRoom,
  leaveRoom,
  startRoom
} from '@caho/contracts';
import { type Player } from '@caho/schemas';
import { z } from 'zod';
import { type App } from '@/app';
import { validateSession } from '@/auth/lucia';
import { HTTPError } from '@/errors/HTTPError';
import { ROOM_ERRORS } from '@/errors/room';
import { RedisRoomRepository } from '@/repositories/room';
import { RoomService } from '@/services/RoomService';

export const roomRoutes = async (app: App) => {
  const roomService = new RoomService(new RedisRoomRepository(app.redis));

  app.get('/list', async () => {
    const publicRooms = await roomService.listPublicRooms();
    return publicRooms;
  });

  app.get(
    '/:roomCode',
    {
      schema: {
        params: z.object({
          roomCode: z.string().min(6).max(6)
        })
      }
    },
    async (req, res) => {
      await validateSession(req, res);
      const { roomCode } = req.params;
      try {
        const room = await roomService.getRoom(roomCode);
        return room;
      } catch (e) {
        if (e instanceof HTTPError) {
          return e;
        }
      }
    }
  );

  app.get(
    '/:roomCode/players',
    {
      schema: {
        params: z.object({
          roomCode: z.string().min(6).max(6)
        })
      }
    },
    async (req, _res) => {
      const { roomCode } = req.params;
      const players = await roomService.getRoomPlayers(roomCode);
      return players;
    }
  );

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

  app.post('/leave', async (req, res) => {
    const { user } = await validateSession(req, res);
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

  app.post('/end', async (req, res) => {
    const { user } = await validateSession(req, res);
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
