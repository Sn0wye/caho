import {
  createRoom,
  endRoom,
  joinRoom,
  leaveRoom,
  startRoom
} from '@caho/contracts';
import { Elysia } from 'elysia';
import { clerkPlugin } from '@/auth/clerk';
import { redis } from '@/db/redis';
import { RedisRoomRepository } from '@/repositories/implementations/RedisRoomRepository';
import { RoomService } from '@/services/RoomService';

export const roomRoutes = new Elysia()
  .state('redis', redis)
  .use(clerkPlugin())
  .group('/rooms', app =>
    app
      .get(
        '/:roomCode',
        async ({ set, params: { roomCode }, store: { redis } }) => {
          const roomRepository = new RedisRoomRepository(redis);
          const roomService = new RoomService(roomRepository);

          const room = await roomService.getRoom(roomCode);

          set.status = 200;
          return room;
        }
      )
      .get('/list', async ({ set, store: { redis } }) => {
        const roomRepository = new RedisRoomRepository(redis);
        const roomService = new RoomService(roomRepository);

        const publicRooms = await roomService.listPublicRooms();

        set.status = 200;
        return publicRooms;
      })
      .post('/create', async ({ body, set, store: { redis } }) => {
        try {
          const validatedBody = createRoom.parse(body);

          const roomRepository = new RedisRoomRepository(redis);
          const roomService = new RoomService(roomRepository);

          const room = await roomService.createRoom(validatedBody);

          set.status = 201;
          return room;
        } catch (e) {
          set.status = 400;
          console.log('ERRO!', JSON.stringify(e, null, 2));
          return 'Invalid body';
        }
      })
      .post('/:roomCode/join', async ({ body, set, store: { redis } }) => {
        try {
          const validatedBody = joinRoom.parse(body);

          const roomRepository = new RedisRoomRepository(redis);
          const roomService = new RoomService(roomRepository);

          const room = await roomService.joinRoom(validatedBody);

          set.status = 200;
          return room;
        } catch {
          set.status = 400;
          return 'Invalid body';
        }
      })
      .post('/:roomCode/start', async ({ body, set, store: { redis } }) => {
        try {
          const validatedBody = startRoom.parse(body);

          const roomRepository = new RedisRoomRepository(redis);
          const roomService = new RoomService(roomRepository);

          await roomService.startRoom(validatedBody);

          set.status = 204;
          return;
        } catch {
          set.status = 400;
          return 'Invalid body';
        }
      })
      .post('/:roomCode/end', async ({ set, body, store: { redis } }) => {
        try {
          const validatedBody = endRoom.parse(body);

          const roomRepository = new RedisRoomRepository(redis);
          const roomService = new RoomService(roomRepository);

          const room = await roomService.endRoom(validatedBody);

          set.status = 200;
          return room;
        } catch {
          set.status = 400;
          return 'Invalid body';
        }
      })
      .post('/leave', async ({ body, set, store: { redis } }) => {
        try {
          const validatedBody = leaveRoom.parse(body);

          const roomRepository = new RedisRoomRepository(redis);
          const roomService = new RoomService(roomRepository);

          await roomService.leaveRoom(validatedBody);

          set.status = 204;
          return;
        } catch {
          set.status = 400;
          return 'Invalid body';
        }
      })
  );
