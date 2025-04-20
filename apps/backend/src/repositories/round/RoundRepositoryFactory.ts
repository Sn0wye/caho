import type { IRoundRepository } from './IRoundRepository';
import { RoundRepository } from './RoundRepository';

export function RoundRepositoryFactory(): IRoundRepository {
  return new RoundRepository();
}
