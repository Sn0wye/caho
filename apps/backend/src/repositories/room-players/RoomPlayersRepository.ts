import { db } from '@/db';
import { roomPlayers } from '@/db/schema';
import type { Player } from '@caho/schemas';
import { and, eq, sql } from 'drizzle-orm';
import type { IRoomPlayersRepository } from './IRoomPlayersRepository';

export class RoomPlayersRepository implements IRoomPlayersRepository {
  private db: typeof db;

  constructor() {
    this.db = db;
  }

  async getRoomPlayersByCode(roomCode: string): Promise<Player[]> {
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
      isJudge: e.room.judgeId === e.player.id,
      cardIds: e.cardIds
    }));

    return mapped;
  }

  async addPlayerToRoom({
    player,
    roomCode
  }: {
    player: Player;
    roomCode: string;
  }): Promise<void> {
    await this.db.insert(roomPlayers).values({
      score: 0,
      roomCode,
      playerId: player.id,
      isHost: player.isHost,
      isReady: player.isReady,
      isJudge: player.isJudge,
      cardIds: []
    });
  }

  async getPlayerFromRoom(
    roomCode: string,
    playerId: string
  ): Promise<Player | undefined> {
    const player = await this.db.query.roomPlayers.findFirst({
      where: and(
        eq(roomPlayers.roomCode, roomCode),
        eq(roomPlayers.playerId, playerId)
      ),
      with: {
        player: true
      }
    });

    if (!player) {
      return undefined;
    }

    return {
      id: player.player.id,
      avatarUrl: player.player.avatarUrl,
      username: player.player.username,
      score: player.score,
      isHost: player.isHost,
      isJudge: player.isJudge,
      isReady: player.isReady,
      cardIds: player.cardIds
    };
  }

  async updatePlayerInRoom(
    roomCode: string,
    playerId: string,
    payload: Partial<Player>
  ): Promise<void> {
    await this.db
      .update(roomPlayers)
      .set(payload)
      .where(
        and(
          eq(roomPlayers.roomCode, roomCode),
          eq(roomPlayers.playerId, playerId)
        )
      )
      .returning()
      .execute();
  }

  async incrementPlayerScore({
    roomCode,
    playerId,
    by
  }: {
    roomCode: string;
    playerId: string;
    by: number;
  }): Promise<void> {
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
  }

  async deletePlayerFromRoom(
    roomCode: string,
    playerId: string
  ): Promise<void> {
    await this.db
      .delete(roomPlayers)
      .where(
        and(
          eq(roomPlayers.roomCode, roomCode),
          eq(roomPlayers.playerId, playerId)
        )
      )
      .execute();
  }
}
