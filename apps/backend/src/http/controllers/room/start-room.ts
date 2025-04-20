import type { App } from '@/app';
import { basePack } from '@/cards/base-pack';
import { ROOM_ERRORS } from '@/errors/room';
import { ensureAuth } from '@/plugins/ensure-auth';
import { CardService } from '@/services/CardService';
import { RoomServiceFactory } from '@/services/room/RoomServiceFactory';
import { getRandomJudge } from '@/utils/getRandomJudge';
import { startRoom } from '@caho/contracts';

// TODO: refactor this controller, it's doing business logic
// it should be in the service layer
export const startRoomController = async (app: App) => {
  const roomService = RoomServiceFactory();

  app.register(ensureAuth).post(
    '/start',
    {
      schema: {
        tags: ['Rooms'],
        description: 'Start a room',
        security: [{ cookieAuth: [], bearerAuth: [] }]
      }
    },
    async (req, res) => {
      const user = req.getUser();

      const { roomCode } = startRoom.parse(req.body);
      const cardService = new CardService(roomCode, basePack);
      let room = await roomService.getRoom(roomCode);

      if (user.id !== room.hostId) {
        return res.badRequest(ROOM_ERRORS.IS_NOT_ROOM_HOST);
      }

      const players = await roomService.getRoomPlayers(roomCode);
      const judgeId = getRandomJudge(room.prevJudgeId, players);

      room = await roomService.updateRoom(roomCode, {
        judgeId,
        status: 'IN_PROGRESS',
        round: room.round + 1
      });

      await roomService.updatePlayerInRoom(roomCode, judgeId, {
        isJudge: true
      });

      await app.pubsub.publish(roomCode, {
        event: 'room.started',
        payload: room
      });

      const playersWithoutJudge = players.filter(
        player => player.id !== judgeId
      );

      const blackCard = await cardService.getNewBlackCard();
      // card service already updates the black card in the db, this is just
      // to make sure the room object is up to date
      room.currentBlackCardId = blackCard.id;

      // TODO: remove this event as it was replaced by the room.round-start event
      await app.pubsub.publish(roomCode, {
        event: 'room.black-card-drawn',
        payload: blackCard
      });

      for (const player of playersWithoutJudge) {
        const whiteCards = await cardService.getNewWhiteCards(6);
        await app.pubsub.publish(player.id, {
          event: 'player.cards-drawn',
          payload: whiteCards
        });

        await roomService.updatePlayerInRoom(roomCode, player.id, {
          cardIds: whiteCards.map(card => card.id)
        });
      }

      // set players as not ready, because they haven't played the card for this round
      await roomService.setPlayersAsUnready(roomCode);
      for (const player of players) {
        player.isReady = false;

        await app.pubsub.publish(roomCode, {
          event: 'room.player-update',
          payload: player
        });
      }

      const round = await roomService.createRound({
        blackCardId: room.currentBlackCardId,
        judgeId,
        roomCode,
        roundNumber: room.round,
        roundWinnerId: null
      });

      await app.pubsub.publish(roomCode, {
        event: 'room.round-start',
        payload: {
          roundNumber: round.roundNumber,
          blackCard
        }
      });

      res.status(204);
    }
  );
};
