import { type Player, type Ranking, type Room } from '@caho/schemas';
import { createId } from '@paralleldrive/cuid2';
import { and, eq, sql } from 'drizzle-orm';
import { generateCode } from '@/utils/generateCode';
import { db } from '@/db';
import { roomPlayers, rooms } from '@/db/schema';
import { HTTPError } from '@/errors/HTTPError';
import { ROOM_ERRORS } from '@/errors/room';
import { type CreateRoomInput } from '@/schemas/create-room';
import { type JoinRoomInput } from '@/schemas/join-room';
import { type LeaveRoomInput } from '@/schemas/leave-room';
import { type IRoomRepository } from './RoomRepository.interface';

export class PostgresRoomRepository implements IRoomRepository {
  private db: typeof db;

  constructor() {
    this.db = db;
  }

  async getRoom(roomCode: string): Promise<Room> {
    try {
      const room = await this.db.query.rooms.findFirst({
        where: (rooms, { eq }) => eq(rooms.code, roomCode)
      });

      if (!room) {
        throw new HTTPError({
          code: 'NOT_FOUND',
          message: ROOM_ERRORS.ROOM_NOT_FOUND
        });
      }

      return room;
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }

      console.error(error);
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar sala.'
      });
    }
  }

  async createRoom(input: CreateRoomInput): Promise<Room> {
    const roomCode = generateCode();

    try {
      const room = (
        await this.db
          .insert(rooms)
          .values({
            id: createId(),
            status: 'LOBBY',
            code: roomCode,
            ...input,
            round: 0,
            judgeId: null,
            prevJudgeId: null
          })
          .returning()
      )[0];

      return room;
    } catch (e) {
      console.error(e);
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao criar sala.'
      });
    }
  }

  async listPublicRooms(): Promise<Room[]> {
    const publicRooms = await this.db.query.rooms.findMany({
      where: (rooms, { eq, and }) =>
        and(eq(rooms.isPublic, true), eq(rooms.status, 'LOBBY'))
    });

    // TODO: auto expire rooms

    return publicRooms;
  }

  async startRoom(roomCode: string): Promise<void> {
    const exists = await this.roomExists(roomCode);
    if (!exists) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }

    const players = await this.getRoomPlayers(roomCode);
    const playersReady = players.every(p => p.isReady);

    if (!playersReady) {
      throw new HTTPError({
        code: 'BAD_REQUEST',
        message: 'Oops, nem todos os jogadores estão prontos.'
      });
    }

    try {
      await this.db.update(rooms).set({
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
    try {
      await this.db.update(rooms).set({
        status: 'FINISHED'
      });

      const rawRankingData = await this.db.query.roomPlayers.findMany({
        where: (roomPlayers, { eq }) => eq(roomPlayers.roomCode, roomCode),
        with: {
          player: true
        }
      });

      const ranking = rawRankingData
        .sort((a, b) => b.score - a.score)
        .map(r => ({
          id: r.player.id,
          name: r.player.name,
          username: r.player.username,
          avatarUrl: r.player.avatarUrl,
          score: r.score
        }));

      return ranking;
    } catch (error) {
      console.error(error);
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao finalizar sala.'
      });
    }
  }

  async joinRoom(input: JoinRoomInput): Promise<void> {
    const { roomCode, player, password } = input;

    try {
      const room = await this.getRoom(roomCode);

      if (!room) {
        throw new HTTPError({
          code: 'NOT_FOUND',
          message: ROOM_ERRORS.ROOM_NOT_FOUND
        });
      }

      player.isHost = room.hostId === player.id;
      const players = await this.getRoomPlayers(roomCode);

      const playerAlreadyInRoom = players.some(p => p.id === player.id);
      if (playerAlreadyInRoom) {
        throw new HTTPError({
          code: 'BAD_REQUEST',
          message: ROOM_ERRORS.PLAYER_ALREADY_IN_ROOM
        });
      }

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

      await this.addPlayerToRoom({ player, roomCode });
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      } else {
        console.error('Unexpected error in joinRoom:', error);
        throw new HTTPError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao entrar na sala.'
        });
      }
    }
  }

  async leaveRoom(input: LeaveRoomInput): Promise<void> {
    const { roomCode, playerId } = input;

    try {
      // TODO: keep player, but mark as inactive
      await this.db
        .delete(roomPlayers)
        .where(
          and(
            eq(roomPlayers.roomCode, roomCode),
            eq(roomPlayers.playerId, playerId)
          )
        )
        .execute();
    } catch (error) {
      console.error('Error in leaveRoom:', error);
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao sair da sala.'
      });
    }
  }

  async getRoomPlayers(roomCode: string): Promise<Player[]> {
    const exists = await this.roomExists(roomCode);

    if (!exists) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: ROOM_ERRORS.ROOM_NOT_FOUND
      });
    }

    try {
      const players = await this.db.query.roomPlayers.findMany({
        where: (roomPlayers, { eq }) => eq(roomPlayers.roomCode, roomCode),
        with: {
          player: true,
          room: true
        }
      });

      const mapped: Player[] = players.map(e => ({
        id: e.player.id,
        avatarUrl: e.player.avatarUrl,
        username: e.player.username,
        score: e.score,
        isHost: e.isHost,
        isReady: e.isReady,
        isJudge: e.room.judgeId === e.player.id
      }));

      return mapped;
    } catch {
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar jogadores da sala.'
      });
    }
  }

  async addPlayerToRoom({
    player,
    roomCode
  }: {
    player: Player;
    roomCode: string;
  }): Promise<void> {
    // const EXPIRE_TIME = 60 * 60 * 24;
    // TODO: expire rows

    try {
      await this.db.insert(roomPlayers).values({
        score: 0,
        roomCode,
        playerId: player.id,
        isHost: player.isHost,
        isReady: player.isReady
      });
    } catch (e) {
      console.log(e);
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao adicionar jogador na sala.'
      });
    }
  }

  async getPlayerFromRoom(roomCode: string, playerId: string): Promise<Player> {
    const players = await this.getRoomPlayers(roomCode);
    const player = players.find(p => p.id === playerId);

    if (!player) {
      throw new HTTPError({
        code: 'NOT_FOUND',
        message: 'Jogador não encontrado.'
      });
    }

    return player;
  }

  async updatePlayerInRoom(
    roomCode: string,
    playerId: string,
    payload: Partial<Player>
  ): Promise<void> {
    try {
      await this.db
        .update(roomPlayers)
        //FIXME zod schema
        .set(payload)
        .where(
          and(
            eq(roomPlayers.roomCode, roomCode),
            eq(roomPlayers.playerId, playerId)
          )
        )
        .execute();
    } catch (error) {
      console.error(error);
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao alterar status do jogador.'
      });
    }
  }

  async incrementPlayerScore(input: {
    roomCode: string;
    playerId: string;
    by: number;
  }): Promise<void> {
    const { roomCode, playerId, by } = input;

    try {
      await this.db
        .update(roomPlayers)
        .set({
          score: sql`${roomPlayers.score} + ${by}`
        })
        .where(
          and(
            eq(roomPlayers.roomCode, roomCode),
            eq(roomPlayers.playerId, playerId)
          )
        )
        .execute();
    } catch (error) {
      console.error(error);
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao incrementar pontuação do jogador.'
      });
    }
  }

  async updateRoom(roomCode: string, data: Partial<Room>): Promise<Room> {
    try {
      const room = (
        await this.db
          .update(rooms)
          .set(data)
          .where(eq(rooms.code, roomCode))
          .returning()
      )[0];

      return room;
    } catch {
      throw new HTTPError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao atualizar estado da sala.'
      });
    }
  }

  async roomExists(roomCode: string): Promise<boolean> {
    const exists = await this.db.query.rooms.findFirst({
      where: (rooms, { eq }) => eq(rooms.code, roomCode)
    });

    return !!exists;
  }
}