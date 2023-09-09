import {
  type CreateRoom,
  type EndRoom,
  type JoinRoom,
  type LeaveRoom,
  type StartRoom
} from '@caho/contracts';
import { type Player, type Room } from '@caho/schemas';
import { generateCode } from '@/utils/generateCode';
import { HTTPError } from '@/errors/HTTPError';
import { ROOM_ERRORS } from '@/errors/room';
import { type IRoomRepository } from '../IRoomRepository';

export class MockRoomRepository implements IRoomRepository {
  private rooms: Map<string, Room> = new Map();
  private rankings: Map<string, Player[]> = new Map();

  async getRoom(roomCode: string): Promise<Room> {
    const room = this.rooms.get(roomCode);
    if (!room) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }
    return room;
  }

  async createRoom(room: CreateRoom): Promise<Room> {
    const roomCode = 'mock_' + generateCode();
    const createdRoom: Room = {
      id: 'mock_' + generateCode(),
      status: 'LOBBY',
      code: roomCode,
      ...room
    };
    this.rooms.set(roomCode, createdRoom);
    this.rankings.set(roomCode, []);
    return createdRoom;
  }

  async listPublicRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async addPlayerToRoom({
    roomCode,
    player
  }: {
    roomCode: string;
    player: Player;
  }): Promise<void> {
    const room = this.rooms.get(roomCode);
    if (!room) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }
    room.players.push(player);
    const ranking = this.rankings.get(roomCode);
    if (ranking) {
      ranking.push(player);
    }
  }

  async startRoom(input: StartRoom): Promise<void> {
    const { roomCode, playerId } = input;
    const room = this.rooms.get(roomCode);
    if (!room) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }
    const hostId = room.hostId;
    if (hostId !== playerId) {
      throw new HTTPError({
        code: 'BAD_REQUEST',
        message: ROOM_ERRORS.IS_NOT_ROOM_HOST
      });
    }
    room.status = 'IN_PROGRESS';
  }

  async endRoom(input: EndRoom): Promise<{ score: number; player: Player }[]> {
    const { roomCode } = input;
    const room = this.rooms.get(roomCode);
    if (!room) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }
    room.status = 'FINISHED';
    const ranking = this.rankings.get(roomCode);
    if (!ranking) {
      // TODO
      throw new Error('Ranking data not found');
    }
    const parsed = ranking
      .map(player => {
        return {
          score: player.score,
          player: player
        };
      })
      .sort((a, b) => b.score - a.score);
    return parsed;
  }

  async joinRoom(input: JoinRoom): Promise<void> {
    const { roomCode, player, password } = input;
    const room = this.rooms.get(roomCode);
    if (!room) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }

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

    room.players.push(player);
  }

  async leaveRoom(input: LeaveRoom): Promise<void> {
    const { roomCode, playerId } = input;
    const room = this.rooms.get(roomCode);
    if (!room) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }
    room.players = room.players.filter(player => player.id !== playerId);
    const ranking = this.rankings.get(roomCode);

    if (ranking) {
      this.rankings.set(
        roomCode,
        ranking.filter(player => player.id !== playerId)
      );
    }
  }
}
