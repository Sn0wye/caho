import type { App } from '@/app';
import { ensureAuth } from '@/plugins/ensure-auth';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { z } from 'zod';

export const judgeChooseWinner = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).post(
    '/:roomCode/winner',
    {
      schema: {
        tags: ['Rooms'],
        description: 'Judge chooses a winner for the current round',
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
      const user = req.getUser();
      const { roomCode } = req.params;
      const { winnerPlayerId } = req.body;

      const { room, winner } = await roomService.processJudgeChooseWinner({
        roomCode,
        judgePlayerId: user.id,
        winnerPlayerId
      });

      app.pubsub.publish(room.code, {
        event: 'room.round-end',
        payload: winner
      });

      const nextRound = await roomService.startNextRound(room.code, room.round);

      app.pubsub.publish(room.code, {
        event: 'room.round-start',
        payload: {
          roundNumber: nextRound.roundNumber,
          blackCard: nextRound.blackCard
        }
      });

      const playersWithCards = await roomService.dealCardsToNonJudgePlayers({
        roomCode: room.code,
        judgeId: nextRound.judgeId,
        cardsPerPlayer: 10
      });

      for (const playerWithCards of playersWithCards) {
        await app.pubsub.publish(playerWithCards.playerId, {
          event: 'player.cards-drawn',
          payload: playerWithCards.cards
        });
      }

      return { success: true };
    }
  );
};
