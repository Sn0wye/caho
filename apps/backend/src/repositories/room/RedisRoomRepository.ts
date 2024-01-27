import {
  playerSchema,
  roomSchema,
  type Player,
  type Ranking,
  type Room
} from '@caho/schemas';
import { createId } from '@paralleldrive/cuid2';
import { type Redis } from 'ioredis';
import { generateCode } from '@/utils/generateCode';
import { parseRawRankingData } from '@/utils/parseRawRankingData';
import { HTTPError } from '@/errors/HTTPError';
import { ROOM_ERRORS } from '@/errors/room';
import { type CreateRoomInput } from '@/schemas/create-room';
import { type JoinRoomInput } from '@/schemas/join-room';
import { type LeaveRoomInput } from '@/schemas/leave-room';
import { type IRoomRepository } from './RoomRepository.interface';

export class RedisRoomRepository implements IRoomRepository {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async getRoom(roomCode: string) {
    try {
      const room = await this.redis.hgetall(`room:${roomCode}`);

      if (!room) {
        throw new HTTPError({
          code: 'NOT_FOUND',
          message: ROOM_ERRORS.ROOM_NOT_FOUND
        });
      }

      return roomSchema.parse(room);
    } catch (error) {
      console.error(error);
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar sala.'
      });
    }
  }

  async createRoom(input: CreateRoomInput): Promise<Room> {
    const roomCode = generateCode();

    const createdRoom = {
      id: createId(),
      status: 'LOBBY',
      code: roomCode,
      ...input
    } satisfies Room;

    const roomListKey = createdRoom.isPublic ? 'public_rooms' : 'private_rooms';

    try {
      await Promise.all([
        this.redis.hmset(`room:${roomCode}`, createdRoom),
        this.redis.lpush(roomListKey, roomCode)
      ]);

      const EXPIRE_TIME = 60 * 60 * 24;

      await Promise.all([
        this.redis.expire(`room:${roomCode}`, EXPIRE_TIME),
        this.redis.expire(`room:${roomCode}:ranking`, EXPIRE_TIME),
        this.redis.expire(`room:${roomCode}:players`, EXPIRE_TIME)
      ]);

      return createdRoom;
    } catch {
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao criar sala.'
      });
    }
  }

  async listPublicRooms(): Promise<Room[]> {
    const publicRoomCodes = await this.redis.lrange('public_rooms', 0, -1);

    const roomsPromises = publicRoomCodes.map(roomCode =>
      this.redis.hgetall(`room:${roomCode}`)
    );
    const rooms = await Promise.all(roomsPromises);

    const parsedRooms: Room[] = [];
    const roomsKeysToDelete: string[] = [];

    rooms.forEach((room, index) => {
      const roomCode = publicRoomCodes[index];

      if (room === null) {
        roomsKeysToDelete.push(roomCode);
        return;
      }

      const parsedRoom = roomSchema.safeParse(room);
      // if (!parsedRoom.success) {
      //   roomsKeysToDelete.push(roomCode);
      // } else {
      //   parsedRooms.push(parsedRoom.data);
      // }

      if (parsedRoom.success) {
        parsedRooms.push(parsedRoom.data);
      }
    });

    // TODO: routine to delete invalid rooms
    // await Promise.all(
    //   roomsKeysToDelete.map(roomCode =>
    //     this.redis.lrem('public_rooms', 0, roomCode)
    //   )
    // );

    return parsedRooms;
  }

  async startRoom(roomCode: string): Promise<void> {
    const roomExists = await this.redis.exists(`room:${roomCode}`);

    if (!roomExists) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }

    const players = await this.getRoomPlayers(roomCode);
    const playersReady = players.every(p => p.isReady);

    if (!playersReady) {
      throw new HTTPError({
        code: 'BAD_REQUEST',
        message: 'Oops, nem todos os jogadores estão prontos.'
      });
    }

    try {
      await this.redis.hset(`room:${roomCode}`, {
        status: 'IN_PROGRESS'
      });
    } catch {
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao iniciar sala.'
      });
    }
  }

  async endRoom(roomCode: string): Promise<Ranking> {
    const roomExists = await this.redis.exists(`room:${roomCode}`);

    if (!roomExists) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }

    try {
      await this.redis.hset(`room:${roomCode}`, {
        status: 'FINISHED'
      });

      const rawRankingData = await this.redis.zrange(
        `room:${roomCode}:ranking`,
        0,
        -1,
        'WITHSCORES'
      );

      const parsedRanking = parseRawRankingData(rawRankingData);
      const ranking = await Promise.all(
        Object.keys(parsedRanking).map(async playerId => {
          const player = await this.getPlayerFromRoom(roomCode, playerId);
          return player;
        })
      );

      return ranking;
    } catch (error) {
      console.error(error);
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao finalizar sala.'
      });
    }
  }

  async joinRoom(input: JoinRoomInput): Promise<void> {
    const { roomCode, player, password } = input;

    try {
      const roomExists = await this.redis.exists(`room:${roomCode}`);
      if (!roomExists) {
        throw new HTTPError({
          code: 'NOT_FOUND',
          message: ROOM_ERRORS.ROOM_NOT_FOUND
        });
      }

      const room = await this.getRoom(roomCode);
      const players = await this.getRoomPlayers(roomCode);

      if (players.length >= room.maxPlayers) {
        throw new HTTPError({
          code: 'BAD_REQUEST',
          message: ROOM_ERRORS.ROOM_IS_FULL
        });
      }

      if (!room.isPublic && room.password !== password) {
        throw new HTTPError({
          code: 'BAD_REQUEST',
          message: ROOM_ERRORS.WRONG_PASSWORD
        });
      }

      const playerAlreadyInRoom = players.some(p => p.id === player.id);
      if (playerAlreadyInRoom) {
        throw new HTTPError({
          code: 'BAD_REQUEST',
          message: ROOM_ERRORS.PLAYER_ALREADY_IN_ROOM
        });
      }

      await this.addPlayerToRoom({ player, roomCode });
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      } else {
        console.error('Unexpected error in joinRoom:', error);
        throw new HTTPError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao entrar na sala.'
        });
      }
    }
  }

  async leaveRoom(input: LeaveRoomInput): Promise<void> {
    const { roomCode, playerId } = input;

    try {
      const roomExists = await this.redis.exists(`room:${roomCode}`);
      if (!roomExists) {
        throw new HTTPError({
          code: 'NOT_FOUND',
          message: ROOM_ERRORS.ROOM_NOT_FOUND
        });
      }

      const playersJson = await this.redis.lrange(
        `room:${roomCode}:players`,
        0,
        -1
      );
      const players = playersJson.map(json => JSON.parse(json));
      const updatedPlayers = players.filter(player => player.id !== playerId);

      if (players.length === updatedPlayers.length) {
        throw new HTTPError({
          code: 'NOT_FOUND',
          message: 'O jogador não está na sala.'
        });
      }

      const multi = this.redis.multi();
      multi.del(`room:${roomCode}:players`);
      updatedPlayers.forEach(player => {
        multi.rpush(`room:${roomCode}:players`, JSON.stringify(player));
      });

      await multi.exec();
    } catch (error) {
      console.error('Error in leaveRoom:', error);
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao sair da sala.'
      });
    }
  }

  async getRoomPlayers(roomCode: string): Promise<Player[]> {
    try {
      const players = await this.redis.lrange(
        `room:${roomCode}:players`,
        0,
        -1
      );

      return players.map(player => playerSchema.parse(JSON.parse(player)));
    } catch {
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar jogadores da sala.'
      });
    }
  }

  async addPlayerToRoom({
    player,
    roomCode
  }: {
    player: Player;
    roomCode: string;
  }): Promise<void> {
    try {
      await Promise.all([
        this.redis.rpush(`room:${roomCode}:players`, JSON.stringify(player)),

        this.redis.zadd(`room:${roomCode}:ranking`, player.score, player.id)
      ]);
    } catch {
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao adicionar jogador na sala.'
      });
    }
  }

  async getPlayerFromRoom(roomCode: string, playerId: string): Promise<Player> {
    const players = await this.getRoomPlayers(roomCode);
    const player = players.find(p => p.id === playerId);

    if (!player) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: 'Jogador não encontrado.'
      });
    }

    return player;
  }

  async updatePlayerInRoom(
    roomCode: string,
    playerId: string,
    payload: Partial<Player>
  ): Promise<void> {
    try {
      const playersJson = await this.redis.lrange(
        `room:${roomCode}:players`,
        0,
        -1
      );
      const players = playersJson.map(p => playerSchema.parse(JSON.parse(p)));

      const playerIndex = players.findIndex(p => p.id === playerId);

      if (playerIndex === -1) {
        throw new HTTPError({
          code: 'NOT_FOUND',
          message: 'Jogador não encontrado.'
        });
      }

      players[playerIndex] = {
        ...players[playerIndex],
        ...payload
      };

      const multi = this.redis.multi();

      multi.del(`room:${roomCode}:players`);

      players.forEach(player => {
        multi.rpush(`room:${roomCode}:players`, JSON.stringify(player));
      });

      await multi.exec();
    } catch (error) {
      console.error(error);
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao alterar status do jogador.'
      });
    }
  }

  async incrementPlayerScore(input: {
    roomCode: string;
    playerId: string;
    by: number;
  }): Promise<void> {
    const { roomCode, playerId, by } = input;
    const player = await this.getPlayerFromRoom(roomCode, playerId);

    try {
      await Promise.all([
        this.redis.zincrby(`room:${roomCode}:ranking`, by, playerId),
        this.updatePlayerInRoom(roomCode, playerId, {
          score: player.score + by
        })
      ]);
    } catch (error) {
      console.error(error);
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao incrementar pontuação do jogador.'
      });
    }
  }
}
