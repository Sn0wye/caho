import type { App } from '@/app';
import { basePack } from '@/cards/base-pack';
import { ROOM_ERRORS } from '@/errors/room';
import { ensureAuth } from '@/plugins/ensure-auth';
import { PostgresRoomRepository } from '@/repositories/room/PostgresRoomRepository';
import { CardService } from '@/services/CardService';
import { RoomService } from '@/services/RoomService';
import { getRandomJudge } from '@/utils/getRandomJudge';
import { startRoom } from '@caho/contracts';

export const startRoomController = async (app: App) => {
  const roomService = new RoomService(new PostgresRoomRepository());

  app.register(ensureAuth).post('/start', async (req, res) => {
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
      event: 'room-started',
      payload: room
    });

    const playersWithoutJudge = players.filter(player => player.id !== judgeId);

    const blackCards = await cardService.getNewBlackCards(1);
    await app.pubsub.publish(roomCode, {
      event: 'black-card-drawn',
      payload: blackCards[0]
    });

    for (const player of playersWithoutJudge) {
      const whiteCards = await cardService.getNewWhiteCards(6);
      await app.pubsub.publish(player.id, {
        event: 'cards-drawn',
        payload: whiteCards
      });
    }

    res.status(204);
  });
};
