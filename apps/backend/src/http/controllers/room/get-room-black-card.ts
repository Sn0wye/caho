import type { App } from '@/app';
import { basePack } from '@/cards/base-pack';
import { BadRequestError, NotFoundError } from '@/errors';
import { ROOM_ERRORS } from '@/errors/room';
import { ensureAuth } from '@/plugins/ensure-auth';
import { CardService } from '@/services/CardService';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { z } from 'zod';

export const getRoomBlackCardController = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).get(
    '/:roomCode/black-card',
    {
      schema: {
        params: z.object({
          roomCode: z.string().min(6).max(6)
        }),
        security: [{ cookieAuth: [] }]
      }
    },
    async (req, _res) => {
      const user = req.getUser();
      const { roomCode } = req.params;

      const cardService = new CardService(roomCode, basePack);

      const blackCardId = await roomService.getRoomBlackCardId(roomCode);

      if (!blackCardId) {
        throw new NotFoundError('Carta preta não encontrada');
      }

      const player = await roomService.getPlayerFromRoom(roomCode, user.id);

      const room = await roomService.getRoom(roomCode);

      const isJudge = room.judgeId === player.id;

      if (isJudge) {
        throw new BadRequestError(ROOM_ERRORS.JUDGE_CANNOT_PLAY);
      }

      const blackCard = cardService.getBlackCardById(blackCardId);

      if (!blackCard) {
        throw new NotFoundError('Carta preta não encontrada');
      }

      return blackCard;
    }
  );
};
