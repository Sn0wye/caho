import type { IRankingRepository } from './IRankingRepository';
import { RankingRepository } from './RankingRepository';

export function RankingRepositoryFactory(): IRankingRepository {
  return new RankingRepository();
}
