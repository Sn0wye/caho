import type { Ranking } from '@caho/schemas';

export interface IRankingRepository {
  getRankingByRoomCode(roomCode: string): Promise<Ranking>;
}
