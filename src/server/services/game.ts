import { createId } from '@paralleldrive/cuid2';
import { type Redis } from '@upstash/redis/nodejs';
import { type Player } from '../schemas/player';
import { roomSchema, type CreateRoomSchema, type Room } from '../schemas/room';

export const getRoom = async ({
  redis,
  roomId
}: {
  redis: Redis;
  roomId: string;
}) => {
  const room = await redis.hgetall(`room:${roomId}`);

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
  const player = room.players[0] as Player;
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

// export const startGame = (redis: Redis) => {};

// export const leaveRoom = (redis: Redis) => {};
