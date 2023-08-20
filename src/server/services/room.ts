import { TRPCError } from '@trpc/server';
import { type Redis } from '@upstash/redis';
import { type GameStatuses } from 'types';
import { ROOM_ERRORS } from '../constants/errors';
import {
  roomSchema,
  type CreateRoomSchema,
  type JoinRoomSchema,
  type LeaveRoomSchema,
  type Room,
  type StartRoomSchema
} from '../schemas/room';
import {
  addPlayerToRoom,
  getPlayersFromRoom,
  isPlayerInRoom,
  removePlayerFromRoom
} from './player';
import {
  addPlayerToRanking,
  getPlayerRanking,
  removePlayerFromRanking
} from './ranking';

export const getRoom = async ({
  redis,
  roomCode
}: {
  redis: Redis;
  roomCode: string;
}): Promise<Room> => {
  const room = await redis.hgetall(`room:${roomCode}`);

  if (!room) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ROOM_ERRORS.ROOM_NOT_FOUND
    });
  }

  const parsedRoom = roomSchema.safeParse(room);

  if (!parsedRoom.success) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: parsedRoom.error.message
    });
  }

  return parsedRoom.data;
};

export const createRoom = async ({
  redis,
  input
}: {
  redis: Redis;
  input: CreateRoomSchema;
}): Promise<Room> => {
  const { room, host } = input;

  await redis.hmset(`room:${room.code}`, room);

  const roomListKey = room.isPublic ? 'public_rooms' : 'private_rooms';
  await redis.lpush(roomListKey, room.code);

  await Promise.all([
    addPlayerToRoom({ redis, roomCode: room.code, player: host }),
    addPlayerToRanking({ redis, roomCode: room.code, player: host })
  ]);

  return room;
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

export const startRoom = async ({
  redis,
  input
}: {
  redis: Redis;
  input: StartRoomSchema;
}) => {
  const { roomCode, playerId } = input;

  const room = await getRoom({
    redis,
    roomCode
  });

  if (room.hostId !== playerId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: ROOM_ERRORS.IS_NOT_ROOM_HOST
    });
  }

  await updateRoomStatus({
    redis,
    roomCode,
    status: 'IN_PROGRESS'
  });

  await redis.expire(`room:${roomCode}`, 60 * 60 * 24);
};

export const endRoom = async ({
  redis,
  roomCode
}: {
  redis: Redis;
  roomCode: string;
}) => {
  // TODO: Maybe check if room exists?
  // const room = await getRoom({
  //   redis,
  //   roomCode
  // });

  await updateRoomStatus({
    redis,
    roomCode,
    status: 'FINISHED'
  });

  const ranking = await getPlayerRanking({
    redis,
    roomCode
  });

  return ranking;
};

export const joinRoom = async ({
  redis,
  input
}: {
  redis: Redis;
  input: JoinRoomSchema;
}) => {
  const { roomCode, player, password } = input;

  const [room, players] = await Promise.all([
    getRoom({ redis, roomCode }),
    getPlayersFromRoom({ redis, roomCode })
  ]);

  if (players.length >= room.maxPlayers) {
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

  const playerAlreadyInRoom = await isPlayerInRoom({
    redis,
    roomCode,
    playerId: player.id
  });

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

  await Promise.all([
    removePlayerFromRoom({ redis, roomCode, playerId }),
    removePlayerFromRanking({ redis, roomCode, playerId })
  ]);
};

const updateRoomStatus = async ({
  redis,
  roomCode,
  status
}: {
  redis: Redis;
  roomCode: string;
  status: GameStatuses;
}) => {
  return await redis.hset(`room:${roomCode}`, {
    status
  });
};
