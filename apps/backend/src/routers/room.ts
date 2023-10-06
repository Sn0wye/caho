import {
  createRoom,
  endRoom,
  joinRoom,
  leaveRoom,
  startRoom
} from '@caho/contracts';
import { type Player } from '@caho/schemas';
import { eq } from 'drizzle-orm';
import { Elysia } from 'elysia';
import { isAuthed } from '@/auth/lucia';
import { ctx } from '@/context';
import { db } from '@/db';
import { users } from '@/db/schema';
import { HTTPError } from '@/errors/HTTPError';
import { ROOM_ERRORS } from '@/errors/room';
import { RedisRoomRepository } from '@/repositories/implementations/RedisRoomRepository';
import { RoomService } from '@/services/RoomService';

export const roomRoutes = new Elysia().use(ctx).group(
  '/rooms',
  {
    beforeHandle: isAuthed
  },
  app =>
    app
      .get('/list', async ({ set, redis }) => {
        const roomRepository = new RedisRoomRepository(redis);
        const roomService = new RoomService(roomRepository);

        const publicRooms = await roomService.listPublicRooms();

        set.status = 200;
        return publicRooms;
      })
      .get('/:roomCode', async ({ set, params: { roomCode }, redis }) => {
        const roomRepository = new RedisRoomRepository(redis);
        const roomService = new RoomService(roomRepository);

        const room = await roomService.getRoom(roomCode);

        set.status = 200;
        return room;
      })
      .post('/create', async ({ body, set, redis, session }) => {
        try {
          const validatedBody = createRoom.parse(body);

          if (!session) {
            throw new HTTPError({
              code: 'BAD_REQUEST',
              message: 'Unauthorized'
            });
          }

          const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.userId)
          });

          if (!user) {
            return 'User not found';
          }

          const roomRepository = new RedisRoomRepository(redis);
          const roomService = new RoomService(roomRepository);

          const host: Player = {
            ...user,
            isHost: true,
            score: 0
          };

          const room = await roomService.createRoom({
            ...validatedBody,
            hostId: user.id,
            host
          });

          set.status = 201;
          return room;
        } catch (e) {
          set.status = 400;
          return e;
        }
      })
      .post('/join', async ({ body, set, session, redis }) => {
        try {
          if (!session) {
            throw new HTTPError({
              code: 'BAD_REQUEST',
              message: 'Unauthorized'
            });
          }

          const validatedBody = joinRoom.parse(body);

          const roomRepository = new RedisRoomRepository(redis);
          const roomService = new RoomService(roomRepository);

          const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.userId)
          });

          if (!user) {
            throw new HTTPError({
              code: 'BAD_REQUEST',
              message: 'User not found'
            });
          }

          const player = {
            id: user.id,
            isHost: false,
            score: 0,
            username: user.username,
            avatarUrl: user.avatarUrl
          } satisfies Player;

          const room = await roomService.joinRoom({
            ...validatedBody,
            player
          });

          set.status = 200;
          return room;
        } catch (e) {
          set.status = 400;
          return e;
        }
      })
      .post('/start', async ({ body, set, session, redis }) => {
        try {
          if (!session) {
            throw new HTTPError({
              code: 'BAD_REQUEST',
              message: 'Unauthorized'
            });
          }

          const { roomCode } = startRoom.parse(body);

          const roomRepository = new RedisRoomRepository(redis);
          const roomService = new RoomService(roomRepository);

          const { hostId } = await roomService.getRoom(roomCode);

          if (session.user.userId !== hostId) {
            set.status = 400;
            return ROOM_ERRORS.IS_NOT_ROOM_HOST;
          }

          await roomService.startRoom(roomCode);

          set.status = 204;
          return;
        } catch (e) {
          set.status = 400;
          return e;
        }
      })
      .post('/end', async ({ set, body, session, redis }) => {
        try {
          if (!session) {
            throw new HTTPError({
              code: 'BAD_REQUEST',
              message: 'Unauthorized'
            });
          }

          const { roomCode } = endRoom.parse(body);

          const roomRepository = new RedisRoomRepository(redis);
          const roomService = new RoomService(roomRepository);

          const { hostId } = await roomService.getRoom(roomCode);

          const isAdmin = session.user.userId === hostId;

          if (!isAdmin) {
            set.status = 400;
            return ROOM_ERRORS.IS_NOT_ROOM_HOST;
          }

          const room = await roomService.endRoom(roomCode);
          console.log('depois do endroom');

          set.status = 200;
          return room;
        } catch (e) {
          set.status = 400;
          return e;
        }
      })
      .post('/leave', async ({ body, set, redis, session }) => {
        try {
          if (!session) {
            throw new HTTPError({
              code: 'BAD_REQUEST',
              message: 'Unauthorized'
            });
          }

          const { roomCode } = leaveRoom.parse(body);

          const roomRepository = new RedisRoomRepository(redis);
          const roomService = new RoomService(roomRepository);

          await roomService.leaveRoom({
            roomCode,
            playerId: session.user.userId
          });

          set.status = 204;
          return;
        } catch (e) {
          set.status = 400;
          return e;
        }
      })
      .get('/:roomCode/players', async ({ params, redis }) => {
        const roomRepository = new RedisRoomRepository(redis);
        const roomService = new RoomService(roomRepository);

        const players = await roomService.getRoomPlayers(params.roomCode);
        return players;
      })
);
