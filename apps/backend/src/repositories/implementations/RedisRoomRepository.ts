import {
  playerSchema,
  roomSchema,
  type Player,
  type Ranking,
  type Room
} from '@caho/schemas';
import { createId } from '@paralleldrive/cuid2';
import { type Redis } from '@upstash/redis/nodejs';
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
    const room = await this.redis.hgetall(`room:${roomCode}`);

    if (!room) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }

    return roomSchema.parse(room);
  }

  async createRoom(input: CreateRoomInput): Promise<Room> {
    const { host, ...data } = input;
    const roomCode = generateCode();

    const createdRoom: Room = {
      id: createId(),
      status: 'LOBBY',
      code: roomCode,
      ...data
    } satisfies Room;

    await this.redis.hmset(`room:${roomCode}`, createdRoom);
    await this.redis.expire(`room:${roomCode}`, 60 * 60 * 24);

    const roomListKey = createdRoom.isPublic ? 'public_rooms' : 'private_rooms';
    await this.redis.lpush(roomListKey, roomCode);

    await this.addPlayerToRoom({
      player: host,
      roomCode
    });

    return createdRoom;
  }

  async listPublicRooms(): Promise<Room[]> {
    const publicRoomCodes = await this.redis.lrange('public_rooms', 0, -1);

    const parsedRooms = [];

    for (const roomCode of publicRoomCodes) {
      const room = await this.redis.hgetall(`room:${roomCode}`);
      console.log(room);
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

  async startRoom(roomCode: string): Promise<void> {
    const roomExists = await this.redis.exists(`room:${roomCode}`);

    if (!roomExists) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }

    await this.redis.hset(`room:${roomCode}`, {
      status: 'IN_PROGRESS'
    });
  }

  async endRoom(roomCode: string): Promise<Ranking> {
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

    const ranking = await this.redis.zrange(`room:${roomCode}:ranking`, 0, -1, {
      withScores: true
    });

    console.log('ranking', JSON.stringify(ranking, null, 2));

    type Entry = {
      score: number;
      member: string;
    };

    const parsed = (ranking as Entry[])
      .map(entry => {
        console.log(JSON.stringify(entry));

        return {
          score: entry.score,
          player: playerSchema.parse(JSON.parse(entry.member))
        };
      })
      .sort((a, b) => b.score - a.score);

    return parsed;
  }

  async joinRoom(input: JoinRoomInput): Promise<void> {
    const { roomCode, player, password } = input;

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
  }

  async leaveRoom(input: LeaveRoomInput): Promise<void> {
    const { roomCode, playerId } = input;

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
  }

  async getRoomPlayers(roomCode: string): Promise<Player[]> {
    const players = await this.redis.lrange(`room:${roomCode}:players`, 0, -1);

    return players.map(player => playerSchema.parse(player));
  }
}
