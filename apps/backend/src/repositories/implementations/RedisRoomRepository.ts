import {
  playerSchema,
  roomSchema,
  type Player,
  type Ranking,
  type Room
} from '@caho/schemas';
import { createId } from '@paralleldrive/cuid2';
import { type Redis } from '@upstash/redis/nodejs';
import { transformRankingData } from '@/utils/formatRankingData';
import { generateCode } from '@/utils/generateCode';
import { HTTPError } from '@/errors/HTTPError';
import { ROOM_ERRORS } from '@/errors/room';
import { type IRoomRepository } from '@/repositories/IRoomRepository';
import { type CreateRoomInput } from '@/schemas/create-room';
import { type JoinRoomInput } from '@/schemas/join-room';
import { type LeaveRoomInput } from '@/schemas/leave-room';

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
    } catch {
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar sala.'
      });
    }
  }

  async createRoom(input: CreateRoomInput): Promise<Room> {
    const { host, ...data } = input;
    const roomCode = generateCode();

    const createdRoom = {
      id: createId(),
      status: 'LOBBY',
      code: roomCode,
      ...data
    } satisfies Room;

    const roomListKey = createdRoom.isPublic ? 'public_rooms' : 'private_rooms';

    try {
      await Promise.all([
        this.redis.hmset(`room:${roomCode}`, createdRoom),

        this.addPlayerToRoom({
          player: host,
          roomCode
        }),

        this.redis.lpush(roomListKey, roomCode)
      ]);

      const EXPIRE_TIME = 60 * 60 * 24; // 24 hours

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
      if (!parsedRoom.success) {
        roomsKeysToDelete.push(roomCode);
      } else {
        parsedRooms.push(parsedRoom.data);
      }
    });

    await Promise.all(
      roomsKeysToDelete.map(roomCode =>
        this.redis.lrem('public_rooms', 0, roomCode)
      )
    );

    return parsedRooms;
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

        this.redis.zadd(`room:${roomCode}:ranking`, {
          score: player.score,
          member: JSON.stringify(player)
        })
      ]);
    } catch {
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao adicionar jogador na sala.'
      });
    }
  }

  async startRoom(roomCode: string): Promise<void> {
    const roomExists = await this.redis.exists(`room:${roomCode}`);

    if (!roomExists) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
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

      const ranking: (object | number)[] = await this.redis.zrange(
        `room:${roomCode}:ranking`,
        0,
        -1,
        {
          withScores: true
        }
      );

      const parsedRanking = transformRankingData(ranking);

      return parsedRanking;
    } catch {
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

      const room = roomSchema.parse(await this.getRoom(roomCode));
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

      await this.addPlayerToRoom({
        player,
        roomCode
      });
    } catch {
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao entrar na sala.'
      });
    }
  }

  async leaveRoom(input: LeaveRoomInput): Promise<void> {
    const { roomCode, playerId } = input;

    try {
      const roomExists = this.redis.exists(`room:${roomCode}`);

      if (!roomExists) {
        throw new HTTPError({
          code: 'NOT_FOUND',
          message: ROOM_ERRORS.ROOM_NOT_FOUND
        });
      }

      const players = await this.getRoomPlayers(roomCode);

      const playerToRemove = players.find(p => p.id === playerId);

      await this.redis.lrem(`room:${roomCode}:players`, 0, playerToRemove);
    } catch {
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

      return players.map(player => playerSchema.parse(player));
    } catch {
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar jogadores da sala.'
      });
    }
  }
}
