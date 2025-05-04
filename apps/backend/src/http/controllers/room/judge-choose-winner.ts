import type { App } from '@/app';
import { basePack } from '@/cards/base-pack';
import { NotFoundError } from '@/errors';
import { ensureAuth } from '@/plugins/ensure-auth';
import { CardService } from '@/services/CardService';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { z } from 'zod';

export const judgeChooseWinner = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).post(
    '/:roomCode/winner',
    {
      schema: {
        tags: ['Rooms'],
        description: 'Join a room',
        body: z.object({
          winnerPlayerId: z.string()
        }),
        params: z.object({
          roomCode: z.string().min(6).max(6)
        }),
        security: [{ cookieAuth: [], bearerAuth: [] }]
      }
    },
    async req => {
      const cardService = new CardService(req.params.roomCode, basePack);

      const user = req.getUser();

      const room = await roomService.getRoom(req.params.roomCode);

      if (!room) {
        throw new NotFoundError('Room not found');
      }

      const player = await roomService.getPlayerFromRoom(
        req.params.roomCode,
        user.id
      );

      if (!player) {
        throw new NotFoundError('Player not found');
      }

      if (!player.isJudge) {
        throw new Error('Player is not a judge');
      }

      const winner = await roomService.judgeChooseWinner({
        judgePlayerId: player.id,
        roomCode: room.code,
        winnerPlayerId: req.body.winnerPlayerId
      });

      app.pubsub.publish(room.code, {
        event: 'room.round-end',
        payload: winner
      });

      // TODO: this should be encapsulated in the service
      // TODO: #2 analize if the room.round-start event should be sent as soon as the
      // room.round-end or wait for players to be ready again
      const nextRound = await roomService.nextRound(room.code, room.round);

      app.pubsub.publish(room.code, {
        event: 'room.round-start',
        payload: {
          roundNumber: nextRound.roundNumber,
          blackCard: nextRound.blackCard
        }
      });

      const roomPlayers = await roomService.getRoomPlayers(room.code);
      const playersWithoutJudge = roomPlayers.filter(
        player => player.id !== nextRound.judgeId
      );

      for (const player of playersWithoutJudge) {
        const whiteCards = await cardService.getNewWhiteCards(10);
        await app.pubsub.publish(player.id, {
          event: 'player.cards-drawn',
          payload: whiteCards
        });

        await roomService.updatePlayerInRoom(room.code, player.id, {
          cardIds: whiteCards.map(card => card.id)
        });
      }
    }
  );
};
