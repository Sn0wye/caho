import { createId } from '@paralleldrive/cuid2';
import { TRPCError } from '@trpc/server';
import { type Redis } from '@upstash/redis/nodejs';
import { ROOM_ERRORS } from '../constants/errors';
import { playerSchema, type Player } from '../schemas/player';
import {
  roomSchema,
  type CreateRoomSchema,
  type JoinRoomSchema,
  type LeaveRoomSchema,
  type Room,
  type StartRoomSchema
} from '../schemas/room';
import { generateCode } from '../utils/generateCode';

export const getRoom = async ({
  redis,
  roomCode
}: {
  redis: Redis;
  roomCode: string;
}) => {
  const room = await redis.hgetall(`room:${roomCode}`);

  if (!room) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ROOM_ERRORS.ROOM_NOT_FOUND
    });
  }

  return roomSchema.parse(room);
};

export const createRoom = async ({
  redis,
  room
}: {
  redis: Redis;
  room: CreateRoomSchema;
}) => {
  const roomCode = generateCode();
  const createdRoom: Room = {
    id: createId(),
    status: 'LOBBY',
    code: roomCode,
    ...room
  };

  await redis.hmset(`room:${roomCode}`, createdRoom);

  const roomListKey = room.isPublic ? 'public_rooms' : 'private_rooms';
  await redis.lpush(roomListKey, roomCode);

  const player = {
    ...room.players[0],
    isHost: true
  } as Player;

  await addPlayerToRoom({
    redis,
    player,
    roomCode
  });

  return createdRoom;
};

export const listPublicRooms = async ({ redis }: { redis: Redis }) => {
  const publicRoomCodes = await redis.lrange('public_rooms', 0, -1);

  const parsedRooms = [];

  for (const roomCode of publicRoomCodes) {
    const room = await redis.hgetall(`room:${roomCode}`);

    parsedRooms.push(roomSchema.parse(room));
  }

  return parsedRooms;
};

export const addPlayerToRoom = async ({
  redis,
  roomCode,
  player
}: {
  redis: Redis;
  roomCode: string;
  player: Player;
}) => {
  await redis.rpush(`room:${roomCode}:players`, JSON.stringify(player));

  await redis.zadd(`room:${roomCode}:ranking`, {
    score: player.score,
    member: JSON.stringify(player)
  });
};

export const startRoom = async ({
  redis,
  input
}: {
  redis: Redis;
  input: StartRoomSchema;
}) => {
  const { roomCode, playerId } = input;

  const roomExists = await redis.exists(`room:${playerId}`);

  if (!roomExists) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ROOM_ERRORS.ROOM_NOT_FOUND
    });
  }

  const hostId = await redis.hget(`room:${roomCode}`, 'hostId');

  if (hostId !== playerId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: ROOM_ERRORS.IS_NOT_ROOM_HOST
    });
  }

  await redis.hset(`room:${roomCode}`, {
    status: 'IN_PROGRESS'
  });
};

export const endRoom = async ({
  redis,
  roomCode
}: {
  redis: Redis;
  roomCode: string;
}) => {
  const roomExists = await redis.exists(`room:${roomCode}`);

  if (!roomExists) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ROOM_ERRORS.ROOM_NOT_FOUND
    });
  }

  await redis.hset(`room:${roomCode}`, {
    status: 'FINISHED'
  });

  const ranking = await redis.zrange(`room:${roomCode}:ranking`, 0, -1);

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
};

export const joinRoom = async ({
  redis,
  input
}: {
  redis: Redis;
  input: JoinRoomSchema;
}) => {
  const { roomCode, player, password } = input;

  const roomExists = await redis.exists(`room:${roomCode}`);
  if (!roomExists) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ROOM_ERRORS.ROOM_NOT_FOUND
    });
  }

  const room = roomSchema.parse(await getRoom({ redis, roomCode }));

  if (room.players.length >= room.maxPlayers) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: ROOM_ERRORS.ROOM_IS_FULL
    });
  }

  if (!room.isPublic && room.password !== password) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: ROOM_ERRORS.WRONG_PASSWORD
    });
  }

  const playerAlreadyInRoom = room.players.some(p => p.id === player.id);

  if (playerAlreadyInRoom) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: ROOM_ERRORS.PLAYER_ALREADY_IN_ROOM
    });
  }

  await addPlayerToRoom({ redis, roomCode, player });
};

export const leaveRoom = async ({
  redis,
  input
}: {
  redis: Redis;
  input: LeaveRoomSchema;
}) => {
  const { roomCode, playerId } = input;

  const roomExists = redis.exists(`room:${roomCode}`);

  if (!roomExists) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ROOM_ERRORS.ROOM_NOT_FOUND
    });
  }

  await redis.lrem(`room:${roomCode}:players`, 0, playerId);
};
