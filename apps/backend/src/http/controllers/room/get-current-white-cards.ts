import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { z } from 'zod';

export const getCurrentWhiteCardsController = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).get(
    '/:roomCode/white-cards',
    {
      schema: {
        tags: ['Rooms'],
        params: z.object({
          roomCode: z.string().min(6).max(6)
        }),
        description: 'Get current white cards',
        security: [{ cookieAuth: [], bearerAuth: [] }]
      }
    },
    async req => {
      const user = req.getUser();

      const { roomCode } = req.params;

      const currentWhiteCards = await roomService.getCurrentWhiteCards(
        roomCode,
        user.id
      );

      return currentWhiteCards;
    }
  );
};
