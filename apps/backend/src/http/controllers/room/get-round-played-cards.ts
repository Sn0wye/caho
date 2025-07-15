import type { App } from '@/app';
import { ForbiddenError } from '@/errors';
import { ensureAuth } from '@/plugins/ensure-auth';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { z } from 'zod';

export const getRoomController = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).get(
    '/:roomCode/round-played-cards',
    {
      schema: {
        tags: ['Rooms'],
        description: 'Get Round played cards as a Judge',
        params: z.object({
          roomCode: z.string().min(6).max(6)
        }),
        security: [{ cookieAuth: [], bearerAuth: [] }]
      }
    },
    async req => {
      const { roomCode } = req.params;
      const user = req.getUser();

      const player = await roomService.getPlayerFromRoom(roomCode, user.id);

      if (!player.isJudge) {
        throw new ForbiddenError(
          'Você não é o juiz desta rodada, não pode ver as cartas jogadas.'
        );
      }

      const room = await roomService.getRoom(roomCode);

      const roundPlayedCards = await roomService.getRoundPlayedCards(
        roomCode,
        room.round
      );

      return roundPlayedCards;
    }
  );
};
