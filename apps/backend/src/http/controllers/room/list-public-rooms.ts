import { type App } from '@/app';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';

export const listPublicController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

  app.get('/list', async () => {
    const publicRooms = await roomService.listPublicRooms();
    return publicRooms;
  });
};
