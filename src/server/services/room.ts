import { createId } from '@paralleldrive/cuid2';
import { TRPCError } from '@trpc/server';
import { type Redis } from '@upstash/redis/nodejs';
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
      message: 'A sala não existe.' // TODO
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

  // Armazenar os dados da sala no Redis
  await redis.hmset(`room:${roomId}`, createdRoom);

  // Adicionar a sala recém-criada à lista de salas públicas ou privadas, dependendo do valor de 'isPublic'
  const roomListKey = room.isPublic ? 'public_rooms' : 'private_rooms';
  await redis.lpush(roomListKey, roomId);

  // Adicionar o jogador à lista de jogadores da sala
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
  // Adicionar o jogador à lista de jogadores da sala
  await redis.rpush(`room:${roomId}:players`, JSON.stringify(player));

  // Adicionar o jogador ao ranking da sala
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
      message: 'A sala não existe.' // TODO
    });
  }

  const hostId = await redis.hget(`room:${roomId}`, 'hostId');

  if (hostId !== playerId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Você não é o host da sala.' // TODO
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
      message: 'A sala não existe.' // TODO
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

  // Verificar se a sala existe
  const roomExists = await redis.exists(`room:${roomId}`);
  if (!roomExists) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'A sala não existe' // TODO
    });
  }

  // Obter os detalhes da sala
  const room = roomSchema.parse(await getRoom({ redis, roomId }));

  // Verificar se a sala está cheia
  if (room.players.length >= room.maxPlayers) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'A sala está cheia'
    });
  }

  // Verificar se a senha está correta
  if (room.password !== password) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Senha incorreta!'
    });
  }

  // Verificar se o jogador já está na sala
  const playerAlreadyInRoom = room.players.some(p => p.id === player.id);

  if (playerAlreadyInRoom) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Você já está na sala!'
    });
  }

  // Adicionar o jogador à sala e atualizar o ranking
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
      message: 'A sala não existe.' // TODO
    });
  }

  await redis.lrem(`room:${roomId}:players`, 0, playerId);
};
