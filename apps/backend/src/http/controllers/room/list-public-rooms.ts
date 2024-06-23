import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { RoomService } from '@/services/RoomService';
import { listPublicRoomsResponse } from '@caho/contracts';
export const listPublicController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

  app.register(ensureAuth).get(
    '/list',
    {
      schema: {
        response: {
          200: listPublicRoomsResponse
        },
        security: [{ cookieAuth: [] }]
      }
    },
    async () => {
      const publicRooms = await roomService.listPublicRooms();

      return publicRooms;
    }
  );
};
