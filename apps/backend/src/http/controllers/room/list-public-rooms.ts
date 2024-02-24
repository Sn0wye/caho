import { type App } from '@/app';
import { RedisRoomRepository } from '@/repositories/room';
import { RoomService } from '@/services/RoomService';

export const listPublicController = async (app: App) => {
  const roomService = new RoomService(new RedisRoomRepository(app.redis));

  app.get('/list', async () => {
    const publicRooms = await roomService.listPublicRooms();
    return publicRooms;
  });
};
