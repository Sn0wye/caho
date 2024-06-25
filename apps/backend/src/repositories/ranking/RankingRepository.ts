import { db } from '@/db';
import type { Ranking } from '@caho/schemas';
import type { IRankingRepository } from './IRankingRepository';

export class RankingRepository implements IRankingRepository {
  private db: typeof db;

  constructor() {
    this.db = db;
  }

  async getRankingByRoomCode(roomCode: string): Promise<Ranking> {
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
  }
}
