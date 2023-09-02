import { createId } from '@paralleldrive/cuid2';
import { type Redis } from '@upstash/redis/nodejs';
import { generateCode } from '@/utils/generateCode';
import { HTTPError } from '@/errors/HTTPError';
import { ROOM_ERRORS } from '@/errors/room';
import { type IRoomRepository } from '@/repositories/IRoomRepository';
import { playerSchema, type Player } from '@/schemas/player';
import {
  roomSchema,
  type CreateRoomSchema,
  type JoinRoomSchema,
  type LeaveRoomSchema,
  type Room,
  type StartRoomSchema
} from '@/schemas/room';

export class RedisRoomRepository implements IRoomRepository {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async getRoom(roomCode: string) {
    const room = await this.redis.hgetall(`room:${roomCode}`);

    if (!room) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }

    return roomSchema.parse(room);
  }

  async createRoom(room: CreateRoomSchema): Promise<Room> {
    const roomCode = generateCode();
    const createdRoom: Room = {
      id: createId(),
      status: 'LOBBY',
      code: roomCode,
      ...room
    };

    await this.redis.hmset(`room:${roomCode}`, createdRoom);

    const roomListKey = room.isPublic ? 'public_rooms' : 'private_rooms';
    await this.redis.lpush(roomListKey, roomCode);

    const player = {
      ...room.players[0],
      isHost: true
    } as Player;

    await this.addPlayerToRoom({
      player,
      roomCode
    });

    return createdRoom;
  }

  async listPublicRooms(): Promise<Room[]> {
    const publicRoomCodes = await this.redis.lrange('public_rooms', 0, -1);

    const parsedRooms = [];

    for (const roomCode of publicRoomCodes) {
      const room = await this.redis.hgetall(`room:${roomCode}`);
      parsedRooms.push(roomSchema.parse(room));
    }

    return parsedRooms;
  }

  async addPlayerToRoom({
    player,
    roomCode
  }: {
    player: Player;
    roomCode: string;
  }): Promise<void> {
    await this.redis.rpush(`room:${roomCode}:players`, JSON.stringify(player));

    await this.redis.zadd(`room:${roomCode}:ranking`, {
      score: player.score,
      member: JSON.stringify(player)
    });
  }

  async startRoom(input: StartRoomSchema): Promise<void> {
    const { roomCode, playerId } = input;

    const roomExists = await this.redis.exists(`room:${playerId}`);

    if (!roomExists) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }

    const hostId = await this.redis.hget(`room:${roomCode}`, 'hostId');

    if (hostId !== playerId) {
      throw new HTTPError({
        code: 'BAD_REQUEST',
        message: ROOM_ERRORS.IS_NOT_ROOM_HOST
      });
    }

    await this.redis.hset(`room:${roomCode}`, {
      status: 'IN_PROGRESS'
    });
  }

  async endRoom(roomCode: string): Promise<
    {
      score: number;
      player: Player;
    }[]
  > {
    const roomExists = await this.redis.exists(`room:${roomCode}`);

    if (!roomExists) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }

    await this.redis.hset(`room:${roomCode}`, {
      status: 'FINISHED'
    });

    const ranking = await this.redis.zrange(`room:${roomCode}:ranking`, 0, -1);

    type Entry = {
      score: number;
      member: string;
    };

    const parsed = (ranking as Entry[])
      .map(entry => {
        return {
          score: entry.score,
          player: playerSchema.parse(JSON.parse(entry.member))
        };
      })
      .sort((a, b) => b.score - a.score);

    return parsed;
  }

  async joinRoom(input: JoinRoomSchema): Promise<void> {
    const { roomCode, player, password } = input;

    const roomExists = await this.redis.exists(`room:${roomCode}`);
    if (!roomExists) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }

    const room = roomSchema.parse(await this.getRoom(roomCode));

    if (room.players.length >= room.maxPlayers) {
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

    const playerAlreadyInRoom = room.players.some(p => p.id === player.id);

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
  }

  async leaveRoom(input: LeaveRoomSchema): Promise<void> {
    const { roomCode, playerId } = input;

    const roomExists = this.redis.exists(`room:${roomCode}`);

    if (!roomExists) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }

    await this.redis.lrem(`room:${roomCode}:players`, 0, playerId);
  }
}
