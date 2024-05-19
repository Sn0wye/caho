import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';

export const listPublicController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

  app.register(ensureAuth).get(
    '/list',
    {
      schema: { security: [{ cookieAuth: [] }] }
    },
    async () => {
      const publicRooms = await roomService.listPublicRooms();
      return publicRooms;
    }
  );
};
