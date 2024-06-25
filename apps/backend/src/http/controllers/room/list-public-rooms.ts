import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { listPublicRoomsResponse } from '@caho/contracts';

export const listPublicController = async (app: App) => {
  const roomService = RoomServiceFactory();

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
