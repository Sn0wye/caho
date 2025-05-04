import {
  ApplicationError,
  BadRequestError,
  InternalServerError,
  NotFoundError
} from '@/errors';
import { ROOM_ERRORS } from '@/errors/room';
import type { IRankingRepository } from '@/repositories/ranking';
import type { IRoomRepository } from '@/repositories/room';
import type { IRoomPlayersRepository } from '@/repositories/room-players';
import { generateCode } from '@/utils/generateCode';
import type {
  BlackCard,
  Player,
  PublicRoomWithPlayerCountAndHost,
  Ranking,
  Room,
  Round,
  RoundPlayedCard,
  RoundWithRelations,
  WhiteCard
} from '@caho/schemas';
import { createId } from '@paralleldrive/cuid2';
import type { IRoomService, JudgeChooseWinnerDTO } from './IRoomService';
import type { CreateRoomDTO } from '@/dto/CreateRoom';
import type { JoinRoomDTO } from '@/dto/JoinRoom';
import type { LeaveRoomDTO } from '@/dto/LeaveRoom';
import { basePack } from '@/cards/base-pack';
import { CardService } from '../CardService';
import type { IRoundRepository } from '@/repositories/round';
import type { IRoundPlayedCardsRepository } from '@/repositories/round-played-cards';
import { getRandomJudge } from '@/utils/getRandomJudge';

export class RoomService implements IRoomService {
  constructor(
    private readonly roomRepository: IRoomRepository,
    private readonly rankingRepository: IRankingRepository,
    private readonly roomPlayersRepository: IRoomPlayersRepository,
    private readonly roundsRepository: IRoundRepository,
    private readonly roundPlayedCardsRepository: IRoundPlayedCardsRepository
  ) {}

  public async getRoom(roomCode: string): Promise<Room> {
    const room = await this.roomRepository.getRoomByCode(roomCode);

    if (!room) {
      throw new NotFoundError(ROOM_ERRORS.ROOM_NOT_FOUND);
    }

    return room;
  }

  public async createRoom(data: CreateRoomDTO): Promise<Room> {
    try {
      const room = await this.roomRepository.create({
        id: createId(),
        status: 'LOBBY',
        code: generateCode(),
        hostId: data.hostId,
        isPublic: data.isPublic,
        maxPlayers: data.maxPlayers,
        maxPoints: data.maxPoints,
        password: data.password,
        round: 0,
        judgeId: null,
        prevJudgeId: null,
        currentBlackCardId: null,
        pickedBlackCards: [],
        pickedWhiteCards: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return room;
    } catch (e) {
      throw new InternalServerError('Erro ao criar sala.');
    }
  }

  public async listPublicRooms(): Promise<PublicRoomWithPlayerCountAndHost[]> {
    return await this.roomRepository.listPublicRooms();
  }

  public async addPlayerToRoom({
    roomCode,
    player
  }: {
    roomCode: string;
    player: Player;
  }): Promise<void> {
    const room = await this.roomRepository.getRoomByCode(roomCode);

    if (!room) {
      throw new NotFoundError(ROOM_ERRORS.ROOM_NOT_FOUND);
    }

    try {
      return await this.roomPlayersRepository.addPlayerToRoom({
        roomCode,
        player
      });
    } catch (e) {
      throw new InternalServerError('Erro ao adicionar jogador na sala.');
    }
  }

  public async startRoom(roomCode: string): Promise<void> {
    const existingRoom = await this.roomRepository.getRoomByCode(roomCode);

    if (!existingRoom) {
      throw new NotFoundError(ROOM_ERRORS.ROOM_NOT_FOUND);
    }

    const players = await this.roomPlayersRepository.getRoomPlayersByCode(
      roomCode
    );
    const playersReady = players.every(p => p.isReady);

    if (!playersReady) {
      throw new BadRequestError(ROOM_ERRORS.NOT_ALL_PLAYERS_READY);
    }

    try {
      await this.roomRepository.update(existingRoom.id, {
        status: 'IN_PROGRESS'
      });
    } catch {
      throw new InternalServerError('Erro ao iniciar sala.');
    }
  }

  public async endRoom(roomCode: string): Promise<Ranking> {
    try {
      await this.roomRepository.update(roomCode, {
        status: 'FINISHED'
      });

      const ranking = await this.rankingRepository.getRankingByRoomCode(
        roomCode
      );

      return ranking;
    } catch (error) {
      throw new InternalServerError('Erro ao finalizar sala.');
    }
  }

  public async joinRoom(input: JoinRoomDTO): Promise<Room> {
    const { roomCode, player, password } = input;

    try {
      const room = await this.roomRepository.getRoomByCode(roomCode);

      if (!room) {
        throw new NotFoundError(ROOM_ERRORS.ROOM_NOT_FOUND);
      }

      player.isHost = room.hostId === player.id;
      const players = await this.roomPlayersRepository.getRoomPlayersByCode(
        roomCode
      );

      const playerAlreadyInRoom = players.some(p => p.id === player.id);
      if (playerAlreadyInRoom) {
        throw new BadRequestError(ROOM_ERRORS.PLAYER_ALREADY_IN_ROOM);
      }

      if (players.length >= room.maxPlayers) {
        throw new BadRequestError(ROOM_ERRORS.ROOM_IS_FULL);
      }

      if (!room.isPublic && room.password !== password) {
        throw new BadRequestError(ROOM_ERRORS.WRONG_PASSWORD);
      }

      await this.addPlayerToRoom({ player, roomCode });

      return room;
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new InternalServerError('Erro ao entrar na sala.');
    }
  }

  public async leaveRoom(input: LeaveRoomDTO): Promise<void> {
    const { roomCode, playerId } = input;

    try {
      // TODO: keep player, but mark as inactive instead of deleting
      await this.roomPlayersRepository.deletePlayerFromRoom(roomCode, playerId);
    } catch (error) {
      throw new InternalServerError('Erro ao sair da sala.');
    }
  }

  public async getRoomPlayers(roomCode: string): Promise<Player[]> {
    const exists = await this.roomRepository.getRoomByCode(roomCode);

    if (!exists) {
      throw new NotFoundError(ROOM_ERRORS.ROOM_NOT_FOUND);
    }

    try {
      const players = await this.roomPlayersRepository.getRoomPlayersByCode(
        roomCode
      );
      return players;
    } catch {
      throw new InternalServerError('Erro ao buscar jogadores da sala.');
    }
  }

  public async getRoomBlackCardId(roomCode: string): Promise<string | null> {
    const room = await this.roomRepository.getRoomByCode(roomCode);

    if (!room) {
      throw new NotFoundError(ROOM_ERRORS.ROOM_NOT_FOUND);
    }

    return room.currentBlackCardId;
  }

  public async updatePlayerInRoom(
    roomCode: string,
    playerId: string,
    payload: Partial<Player>
  ): Promise<Player> {
    try {
      // TODO: improve this to return the updated player
      await this.roomPlayersRepository.updatePlayerInRoom(
        roomCode,
        playerId,
        payload
      );

      const updatedPlayer = await this.roomPlayersRepository.getPlayerFromRoom(
        roomCode,
        playerId
      );

      if (!updatedPlayer) {
        throw new NotFoundError(ROOM_ERRORS.PLAYER_NOT_FOUND);
      }

      return updatedPlayer;
    } catch {
      throw new InternalServerError('Erro ao atualizar jogador na sala.');
    }
  }

  public async getPlayerFromRoom(
    roomCode: string,
    playerId: string
  ): Promise<Player> {
    const player = await this.roomPlayersRepository.getPlayerFromRoom(
      roomCode,
      playerId
    );

    if (!player) {
      throw new NotFoundError(ROOM_ERRORS.PLAYER_NOT_FOUND);
    }

    return player;
  }

  // TODO: must return player
  public async incrementPlayerScore(input: {
    roomCode: string;
    playerId: string;
    by: number;
  }): Promise<void> {
    try {
      return await this.roomPlayersRepository.incrementPlayerScore(input);
    } catch (error) {
      throw new InternalServerError(
        'Erro ao incrementar pontuação do jogador.'
      );
    }
  }

  public async updateRoom(
    roomCode: string,
    data: Partial<Room>
  ): Promise<Room> {
    try {
      return await this.roomRepository.update(roomCode, data);
    } catch {
      throw new InternalServerError('Erro ao atualizar sala.');
    }
  }

  public async getCurrentWhiteCards(
    roomCode: string,
    playerId: string
  ): Promise<WhiteCard[]> {
    const room = await this.roomRepository.getRoomByCode(roomCode);

    if (!room) {
      throw new NotFoundError(ROOM_ERRORS.ROOM_NOT_FOUND);
    }

    const player = await this.roomPlayersRepository.getPlayerFromRoom(
      roomCode,
      playerId
    );

    if (!player) {
      throw new NotFoundError(ROOM_ERRORS.PLAYER_NOT_FOUND);
    }

    // TODO: PLEASE REMOVE THIS WHEN CARDS ARE IN THE DB
    const currentWhiteCards = basePack.cards.white.filter(whiteCard =>
      player.cardIds.includes(whiteCard.id)
    );

    return currentWhiteCards;
  }

  public async playCards(
    roomCode: string,
    playerId: string,
    playedCardIds: string[]
  ): Promise<WhiteCard[]> {
    const room = await this.roomRepository.getRoomByCode(roomCode);
    if (!room) {
      throw new NotFoundError(ROOM_ERRORS.ROOM_NOT_FOUND);
    }

    const player = await this.roomPlayersRepository.getPlayerFromRoom(
      roomCode,
      playerId
    );

    if (!player) {
      throw new NotFoundError(ROOM_ERRORS.PLAYER_NOT_FOUND);
    }

    // get the current round or create a new one.

    const currentRound = await this.roundsRepository.find(roomCode, room.round);

    if (!currentRound) {
      throw new NotFoundError(ROOM_ERRORS.ROUND_NOT_FOUND);
    }

    await this.roundPlayedCardsRepository.create({
      playerId: player.id,
      roundId: currentRound.id,
      whiteCardIds: playedCardIds
    });

    const cardService = new CardService(roomCode, basePack);
    const newWhiteCardsAmount = playedCardIds.length;

    const newWhiteCards = await cardService.getNewWhiteCards(
      newWhiteCardsAmount
    );

    // remove cards from player hand and complete with new cards
    player.cardIds = player.cardIds.filter(
      cardId => !playedCardIds.includes(cardId)
    );

    player.cardIds.push(...newWhiteCards.map(card => card.id));

    await this.roomPlayersRepository.updatePlayerInRoom(roomCode, playerId, {
      cardIds: player.cardIds,
      isReady: true
    });

    return newWhiteCards;
  }

  public async setPlayersAsUnready(roomCode: string): Promise<void> {
    try {
      await this.roomPlayersRepository.setPlayersAsUnready(roomCode);
    } catch (error) {
      throw new InternalServerError(
        'Erro ao definir jogadores como não prontos.'
      );
    }
  }

  public async createRound(data: CreateRoundDTO): Promise<Round> {
    try {
      const round = await this.roundsRepository.create({
        id: createId(),
        roomCode: data.roomCode,
        judgeId: data.judgeId,
        blackCardId: data.blackCardId,
        roundNumber: data.roundNumber,
        roundWinnerId: data.roundWinnerId,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return round;
    } catch (e) {
      throw new InternalServerError('Erro ao criar rodada.');
    }
  }

  public async getRoundPlayedCards(
    roomCode: string,
    roundNumber: number
  ): Promise<RoundPlayedCard[]> {
    const roundPlayedCards =
      await this.roundPlayedCardsRepository.findByRoomCodeAndRoundNumber(
        roomCode,
        roundNumber
      );

    return roundPlayedCards;
  }

  public async getRoundNumber(roomCode: string): Promise<number> {
    const room = await this.roomRepository.getRoomByCode(roomCode);

    if (!room) {
      throw new NotFoundError(ROOM_ERRORS.ROOM_NOT_FOUND);
    }

    return room.round;
  }

  public async judgeChooseWinner(
    data: JudgeChooseWinnerDTO
  ): Promise<RoundPlayedCard> {
    const room = await this.getRoom(data.roomCode);

    if (!room) {
      throw new NotFoundError('Room not found');
    }

    const player = await this.getPlayerFromRoom(
      data.roomCode,
      data.judgePlayerId
    );

    if (!player) {
      throw new NotFoundError('Player not found');
    }

    if (!player.isJudge) {
      throw new Error('Player is not a judge');
    }

    const round = await this.roundsRepository.find(data.roomCode, room.round);

    if (!round) {
      throw new NotFoundError('Round not found');
    }

    round.roundWinnerId = data.winnerPlayerId;
    round.updatedAt = new Date();

    try {
      await this.roundsRepository.update(round.id, round);
    } catch (error) {
      throw new InternalServerError('Erro ao escolher vencedor.');
    }

    const roundPlayedCards =
      await this.roundPlayedCardsRepository.findByRoomCodeAndRoundNumber(
        data.roomCode,
        room.round
      );

    const winner = roundPlayedCards.find(
      roundPlayedCard => roundPlayedCard.player.id === data.winnerPlayerId
    );

    if (!winner) {
      throw new NotFoundError('Vencedor não encontrado');
    }

    return winner;
  }

  public async nextRound(
    roomCode: string,
    currentRound: number
  ): Promise<
    RoundWithRelations & {
      blackCard: BlackCard;
    }
  > {
    const [room, players, round] = await Promise.all([
      this.roomRepository.getRoomByCode(roomCode),
      this.roomPlayersRepository.getRoomPlayersByCode(roomCode),
      this.roundsRepository.find(roomCode, currentRound)
    ]);

    if (!room) {
      throw new NotFoundError(ROOM_ERRORS.ROOM_NOT_FOUND);
    }

    if (!round) {
      throw new NotFoundError(ROOM_ERRORS.ROUND_NOT_FOUND);
    }

    // TODO: refactor card service to use the db
    const cardService = new CardService(roomCode, basePack);
    const newBlackCard = await cardService.getNewBlackCard();

    const nextJudgeId = getRandomJudge(room.prevJudgeId, players);

    const updatedRoom = await this.roomRepository.update(room.id, {
      round: room.round + 1,
      judgeId: nextJudgeId,
      prevJudgeId: room.judgeId
    });

    const nextRound = await this.roundsRepository.create({
      id: createId(),
      roomCode,
      judgeId: nextJudgeId,
      blackCardId: newBlackCard.id,
      roundNumber: round.roundNumber + 1,
      roundWinnerId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const judge = players.find(player => player.id === nextJudgeId);

    if (!judge) {
      throw new NotFoundError('Judge not found');
    }

    const blackCard = await cardService.getBlackCardById(newBlackCard.id);
    if (!blackCard) {
      throw new NotFoundError('Black card not found');
    }

    return {
      ...nextRound,
      room: updatedRoom,
      judge,
      roundWinner: null,
      roundPlayedCards: [],
      blackCardId: blackCard.id,
      blackCard
    };
  }
}
