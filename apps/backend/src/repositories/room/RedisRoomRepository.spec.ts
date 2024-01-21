import { type Player } from '@caho/schemas';
import Redis from 'ioredis-mock';
import { RedisRoomRepository } from './RedisRoomRepository';

const redis = new Redis();
const roomRepository = new RedisRoomRepository(redis);

const publicRoomMock = {
  hostId: 'public-id',
  isPublic: true,
  maxPlayers: 2,
  maxPoints: 10,
  password: null
};

const privateRoomMock = {
  hostId: 'private-id',
  isPublic: false,
  maxPlayers: 2,
  maxPoints: 20,
  password: '1234'
};

const hostPlayerMock = {
  id: 'player-id',
  isHost: true,
  isReady: false,
  score: 0,
  username: 'host-player',
  avatarUrl: null
} satisfies Player;

const notHostPlayerMock = {
  id: 'player-id2',
  isHost: false,
  isReady: false,
  score: 0,
  username: 'not-host-player',
  avatarUrl: null
} satisfies Player;

describe('RedisRoomRepository', () => {
  beforeEach(async () => {
    await redis.flushall();
  });

  it('should be able to create a public room', async () => {
    const room = await roomRepository.createRoom(publicRoomMock);

    expect(room).toMatchObject({
      hostId: publicRoomMock.hostId,
      isPublic: publicRoomMock.isPublic,
      maxPlayers: publicRoomMock.maxPlayers,
      maxPoints: publicRoomMock.maxPoints,
      password: publicRoomMock.password,
      status: 'LOBBY'
    });
    expect(room.code).toHaveLength(6);
  });

  it('should be able to get a room', async () => {
    const createdRoom = await roomRepository.createRoom(publicRoomMock);
    const room = await roomRepository.getRoom(createdRoom.code);

    expect(room).toMatchObject({
      hostId: publicRoomMock.hostId,
      isPublic: publicRoomMock.isPublic,
      maxPlayers: publicRoomMock.maxPlayers,
      maxPoints: publicRoomMock.maxPoints,
      password: publicRoomMock.password,
      status: 'LOBBY'
    });
    expect(room.code).toHaveLength(6);
  });

  it('should be able to list public rooms', async () => {
    await roomRepository.createRoom(publicRoomMock);
    await roomRepository.createRoom(privateRoomMock);

    const rooms = await roomRepository.listPublicRooms();

    expect(rooms).toHaveLength(1);
  });

  it('should be able to start a room', async () => {
    const room = await roomRepository.createRoom(publicRoomMock);
    await roomRepository.startRoom(room.code);
    const updatedRoom = await roomRepository.getRoom(room.code);

    expect(updatedRoom.status).toBe('IN_PROGRESS');
  });

  it('should be able to end a room', async () => {
    const room = await roomRepository.createRoom(publicRoomMock);
    await roomRepository.startRoom(room.code);
    await roomRepository.endRoom(room.code);
    const updatedRoom = await roomRepository.getRoom(room.code);

    expect(updatedRoom.status).toBe('FINISHED');
  });

  it('should render the ranking correctly', async () => {
    const room = await roomRepository.createRoom(publicRoomMock);
    await roomRepository.joinRoom({
      roomCode: room.code,
      player: hostPlayerMock,
      password: publicRoomMock.password
    });

    await roomRepository.joinRoom({
      roomCode: room.code,
      player: notHostPlayerMock,
      password: publicRoomMock.password
    });

    await roomRepository.startRoom(room.code);

    await roomRepository.incrementPlayerScore({
      roomCode: room.code,
      playerId: hostPlayerMock.id,
      by: 3
    });

    await roomRepository.incrementPlayerScore({
      roomCode: room.code,
      playerId: hostPlayerMock.id,
      by: 1
    });

    await roomRepository.incrementPlayerScore({
      roomCode: room.code,
      playerId: notHostPlayerMock.id,
      by: 1
    });

    const ranking = await roomRepository.endRoom(room.code);
    expect(ranking).toHaveLength(2);
    expect(ranking.find(p => p.id === hostPlayerMock.id)).toMatchObject({
      ...hostPlayerMock,
      score: 4
    });
    expect(ranking.find(p => p.id === notHostPlayerMock.id)).toMatchObject({
      ...notHostPlayerMock,
      score: 1
    });
  });

  it('should be able to join a public room', async () => {
    const room = await roomRepository.createRoom(publicRoomMock);

    await roomRepository.joinRoom({
      player: hostPlayerMock,
      roomCode: room.code,
      password: null
    });
  });

  it('should not be able to join a room when already on it', async () => {
    const room = await roomRepository.createRoom(publicRoomMock);

    await roomRepository.joinRoom({
      player: hostPlayerMock,
      roomCode: room.code,
      password: null
    });

    await expect(
      roomRepository.joinRoom({
        player: hostPlayerMock,
        roomCode: room.code,
        password: null
      })
    ).rejects.toThrow();
  });

  it('should not be able to join a room when it is full', async () => {
    const room = await roomRepository.createRoom(publicRoomMock);

    await roomRepository.joinRoom({
      player: hostPlayerMock,
      roomCode: room.code,
      password: null
    });

    await roomRepository.joinRoom({
      player: notHostPlayerMock,
      roomCode: room.code,
      password: null
    });

    await expect(
      roomRepository.joinRoom({
        player: {
          ...notHostPlayerMock,
          id: 'another-player-id'
        },
        roomCode: room.code,
        password: null
      })
    ).rejects.toThrow();
  });

  it('should be able to join a private room', async () => {
    const room = await roomRepository.createRoom(privateRoomMock);

    await roomRepository.joinRoom({
      player: hostPlayerMock,
      roomCode: room.code,
      password: privateRoomMock.password
    });

    const roomPlayers = await roomRepository.getRoomPlayers(room.code);

    expect(roomPlayers).toHaveLength(1);
    expect(roomPlayers[0]).toMatchObject(hostPlayerMock);
  });

  it('should be able to leave a room', async () => {
    const room = await roomRepository.createRoom(publicRoomMock);

    await roomRepository.joinRoom({
      player: hostPlayerMock,
      roomCode: room.code,
      password: null
    });

    await roomRepository.leaveRoom({
      playerId: hostPlayerMock.id,
      roomCode: room.code
    });

    const roomPlayers = await roomRepository.getRoomPlayers(room.code);

    expect(roomPlayers).toHaveLength(0);
  });

  it('should be able to get room players', async () => {
    const room = await roomRepository.createRoom(publicRoomMock);

    await roomRepository.joinRoom({
      player: hostPlayerMock,
      roomCode: room.code,
      password: null
    });

    await roomRepository.joinRoom({
      player: notHostPlayerMock,
      roomCode: room.code,
      password: null
    });

    const roomPlayers = await roomRepository.getRoomPlayers(room.code);

    expect(roomPlayers).toHaveLength(2);
    expect(roomPlayers[0]).toMatchObject(hostPlayerMock);
    expect(roomPlayers[1]).toMatchObject(notHostPlayerMock);
  });

  it('should be able to get a player from a room', async () => {
    const room = await roomRepository.createRoom(publicRoomMock);

    await roomRepository.joinRoom({
      player: hostPlayerMock,
      roomCode: room.code,
      password: null
    });

    const player = await roomRepository.getPlayerFromRoom(
      room.code,
      hostPlayerMock.id
    );

    expect(player).toMatchObject(hostPlayerMock);
  });

  it('should be able to update a player in a room', async () => {
    const room = await roomRepository.createRoom(publicRoomMock);

    await roomRepository.joinRoom({
      player: hostPlayerMock,
      roomCode: room.code,
      password: null
    });

    await roomRepository.updatePlayerInRoom(room.code, hostPlayerMock.id, {
      isReady: true
    });

    const player = await roomRepository.getPlayerFromRoom(
      room.code,
      hostPlayerMock.id
    );

    expect(player).toMatchObject({
      ...hostPlayerMock,
      isReady: true
    });
  });

  it('should be able to increment a player score', async () => {
    const room = await roomRepository.createRoom(publicRoomMock);

    await roomRepository.joinRoom({
      player: hostPlayerMock,
      roomCode: room.code,
      password: null
    });

    await roomRepository.incrementPlayerScore({
      roomCode: room.code,
      playerId: hostPlayerMock.id,
      by: 10
    });

    const ranking = await roomRepository.endRoom(room.code);
    const player = await roomRepository.getPlayerFromRoom(
      room.code,
      hostPlayerMock.id
    );

    expect(ranking).toHaveLength(1);
    expect(ranking[0]).toMatchObject({
      ...hostPlayerMock,
      score: 10
    });
    expect(player).toMatchObject({
      ...hostPlayerMock,
      score: 10
    });
  });
});
