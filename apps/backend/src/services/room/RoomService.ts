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
  Player,
  PublicRoomWithPlayerCountAndHost,
  Ranking,
  Room,
  WhiteCard
} from '@caho/schemas';
import { createId } from '@paralleldrive/cuid2';
import type { IRoomService } from './IRoomService';
import type { CreateRoomDTO } from '@/dto/CreateRoom';
import type { JoinRoomDTO } from '@/dto/JoinRoom';
import type { LeaveRoomDTO } from '@/dto/LeaveRoom';
import { basePack } from '@/cards/base-pack';

export class RoomService implements IRoomService {
  constructor(
    private readonly roomRepository: IRoomRepository,
    private readonly rankingRepository: IRankingRepository,
    private readonly roomPlayersRepository: IRoomPlayersRepository
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
}
