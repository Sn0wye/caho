import {
  createRoom,
  endRoom,
  joinRoom,
  leaveRoom,
  startRoom
} from '@caho/contracts';
import { Type } from '@fastify/type-provider-typebox';
import { type App } from '@/app';
import { getSession } from '../auth/lucia';
import { ROOM_ERRORS } from '../errors/room';
import { RedisRoomRepository } from '../repositories/implementations/RedisRoomRepository';
import { RoomService } from '../services/RoomService';

export const roomRoutes = async (app: App) => {
  app.get('/list', async () => {
    const roomRepository = new RedisRoomRepository(app.redis);
    const roomService = new RoomService(roomRepository);
    const publicRooms = await roomService.listPublicRooms();
    return publicRooms;
  });

  app.get(
    '/:roomCode',
    {
      schema: {
        params: Type.Object({
          roomCode: Type.String()
        })
      }
    },
    async (req, res) => {
      await getSession(req, res);
      const { roomCode } = req.params;
      const roomRepository = new RedisRoomRepository(app.redis);
      const roomService = new RoomService(roomRepository);
      const room = await roomService.getRoom(roomCode);
      return room;
    }
  );

  app.get(
    '/:roomCode/players',
    {
      schema: {
        params: Type.Object({
          roomCode: Type.String()
        })
      }
    },
    async (req, _res) => {
      const { roomCode } = req.params;
      const roomRepository = new RedisRoomRepository(app.redis);
      const roomService = new RoomService(roomRepository);
      const players = await roomService.getRoomPlayers(roomCode);
      return players;
    }
  );

  app.post('/create', async (req, res) => {
    const session = await getSession(req, res);
    try {
      const validatedBody = createRoom.parse(req.body);
      if (!session) {
        return res.unauthorized();
      }

      const user = await app.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, session.user.userId)
      });

      if (!user) {
        return res.notFound('User not found');
      }

      const roomRepository = new RedisRoomRepository(app.redis);
      const roomService = new RoomService(roomRepository);
      const host = {
        ...user,
        isHost: true,
        score: 0
      };
      const room = await roomService.createRoom({
        ...validatedBody,
        hostId: user.id,
        host
      });
      res.status(201);
      return room;
    } catch (e) {
      res.status(400);
      return e;
    }
  });

  app.post('/join', async (req, res) => {
    const session = await getSession(req, res);
    try {
      const validatedBody = joinRoom.parse(req.body);
      const roomRepository = new RedisRoomRepository(app.redis);
      const roomService = new RoomService(roomRepository);
      const user = await app.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, session.user.userId)
      });

      if (!user) {
        return res.notFound('User not found');
      }

      const player = {
        id: user.id,
        isHost: false,
        score: 0,
        username: user.username,
        avatarUrl: user.avatarUrl
      };
      const room = await roomService.joinRoom({
        ...validatedBody,
        player
      });
      return room;
    } catch (e) {
      res.status(400);
      return e;
    }
  });

  app.post('/leave', async (req, res) => {
    const session = await getSession(req, res);
    try {
      const { roomCode } = leaveRoom.parse(req.body);
      const roomRepository = new RedisRoomRepository(app.redis);
      const roomService = new RoomService(roomRepository);
      await roomService.leaveRoom({
        roomCode,
        playerId: session.user.userId
      });
      return res.status(204);
    } catch (e) {
      res.status(400);
      return e;
    }
  });

  app.post('/start', async (req, res) => {
    const session = await getSession(req, res);
    try {
      const { roomCode } = startRoom.parse(req.body);
      const roomRepository = new RedisRoomRepository(app.redis);
      const roomService = new RoomService(roomRepository);
      const { hostId } = await roomService.getRoom(roomCode);

      if (session.user.userId !== hostId) {
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
    const session = await getSession(req, res);
    try {
      const { roomCode } = endRoom.parse(req.body);
      const roomRepository = new RedisRoomRepository(app.redis);
      const roomService = new RoomService(roomRepository);
      const { hostId } = await roomService.getRoom(roomCode);
      const isAdmin = session.user.userId === hostId;

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
