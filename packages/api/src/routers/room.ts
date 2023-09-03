import { RedisRoomRepository } from '@/repositories/implementations/RedisRoomRepository';
import { RoomService } from '@/services/RoomService';
import { type App } from '..';

export const roomRouter = (app: App) =>
  app.group('/rooms', app =>
    app.get(
      '/:roomCode',
      async ({ params: { roomCode }, store: { redis } }) => {
        const roomRepository = new RedisRoomRepository(redis);
        const roomService = new RoomService(roomRepository);

        const room = await roomService.getRoom(roomCode);

        return room;
      }
    )
  );
