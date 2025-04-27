import type { App } from '@/app';
import { BadRequestError } from '@/errors';
import { ensureAuth } from '@/plugins/ensure-auth';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { z } from 'zod';

export const playCardsController = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).post(
    '/:roomCode/play-cards',
    {
      schema: {
        tags: ['Rooms'],
        description: 'Jogar cartas na sala',
        params: z.object({
          roomCode: z.string().min(6).max(6)
        }),
        security: [{ cookieAuth: [], bearerAuth: [] }]
      }
    },
    async (req, res) => {
      const user = req.getUser();
      const playedCards = req.body as string[];
      const { roomCode } = req.params;

      const player = await roomService.getPlayerFromRoom(roomCode, user.id);
      if (!player) {
        throw new BadRequestError(
          'Você não pode jogar cartas em uma sala que não está jogando :L'
        );
      }

      if (player.isReady) {
        throw new BadRequestError('Você já jogou nessa rodada :L');
      }

      if (!playedCards.length) {
        throw new BadRequestError('Você precisa jogar pelo menos uma carta.');
      }

      const cardsDrawn = await roomService.playCards(
        roomCode,
        user.id,
        playedCards
      );

      player.isReady = true;
      await app.pubsub.publish(roomCode, {
        event: 'room.player-update',
        payload: player
      });

      await app.pubsub.publish(player.id, {
        event: 'player.cards-drawn',
        payload: cardsDrawn
      });

      // TODO: if all the players are ready, start the judge phase
      const roomPlayers = await roomService.getRoomPlayers(roomCode);
      const allPlayersReady = roomPlayers.every(player => player.isReady);

      if (allPlayersReady) {
        const roundNumber = await roomService.getRoundNumber(roomCode);

        const roundPlayedCards = await roomService.getRoundPlayedCards(
          roomCode,
          roundNumber
        );

        await app.pubsub.publish(roomCode, {
          event: 'room.time-to-judge',
          payload: {
            roundPlayedCards
          }
        });
      }

      return res.status(204).send();
    }
  );
};
