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

export const getRoom = async ({
  redis,
  roomId
}: {
  redis: Redis;
  roomId: string;
}) => {
  const room = await redis.hgetall(`room:${roomId}`);

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
  const roomId = createId();
  const createdRoom: Room = {
    id: roomId,
    status: 'LOBBY',
    ...room
  };

  await redis.hmset(`room:${roomId}`, createdRoom);

  const roomListKey = room.isPublic ? 'public_rooms' : 'private_rooms';
  await redis.lpush(roomListKey, roomId);

  const player = {
    ...room.players[0],
    isHost: true
  } as Player;

  await addPlayerToRoom({
    redis,
    player,
    roomId
  });

  return createdRoom;
};

export const listRooms = async ({ redis }: { redis: Redis }) => {
  const publicRooms = await redis.lrange('public_rooms', 0, -1);
  const privateRooms = await redis.lrange('private_rooms', 0, -1);

  const parsedRooms = [];

  for (const room of publicRooms) {
    parsedRooms.push(roomSchema.parse(JSON.parse(room)));
  }

  for (const room of privateRooms) {
    parsedRooms.push(roomSchema.parse(JSON.parse(room)));
  }

  return parsedRooms;
};

export const addPlayerToRoom = async ({
  redis,
  roomId,
  player
}: {
  redis: Redis;
  roomId: string;
  player: Player;
}) => {
  await redis.rpush(`room:${roomId}:players`, JSON.stringify(player));

  await redis.zadd(`room:${roomId}:ranking`, {
    score: player.points,
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
  const { roomId, playerId } = input;

  const roomExists = await redis.exists(`room:${playerId}`);

  if (!roomExists) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ROOM_ERRORS.ROOM_NOT_FOUND
    });
  }

  const hostId = await redis.hget(`room:${roomId}`, 'hostId');

  if (hostId !== playerId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: ROOM_ERRORS.IS_NOT_ROOM_HOST
    });
  }

  await redis.hset(`room:${roomId}`, {
    status: 'IN_PROGRESS'
  });
};

export const endRoom = async ({
  redis,
  roomId
}: {
  redis: Redis;
  roomId: string;
}) => {
  const roomExists = await redis.exists(`room:${roomId}`);

  if (!roomExists) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ROOM_ERRORS.ROOM_NOT_FOUND
    });
  }

  await redis.hset(`room:${roomId}`, {
    status: 'FINISHED'
  });

  const ranking = await redis.zrange(`room:${roomId}:ranking`, 0, -1);

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
  const { roomId, player, password } = input;

  const roomExists = await redis.exists(`room:${roomId}`);
  if (!roomExists) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ROOM_ERRORS.ROOM_NOT_FOUND
    });
  }

  const room = roomSchema.parse(await getRoom({ redis, roomId }));

  if (room.players.length >= room.maxPlayers) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: ROOM_ERRORS.ROOM_IS_FULL
    });
  }

  if (room.password !== password) {
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

  await addPlayerToRoom({ redis, roomId, player });
};

export const leaveRoom = async ({
  redis,
  input
}: {
  redis: Redis;
  input: LeaveRoomSchema;
}) => {
  const { roomId, playerId } = input;

  const roomExists = redis.exists(`room:${roomId}`);

  if (!roomExists) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ROOM_ERRORS.ROOM_NOT_FOUND
    });
  }

  await redis.lrem(`room:${roomId}:players`, 0, playerId);
};
