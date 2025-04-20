import type { IRoundPlayedCardsRepository } from './IRoundPlayedCardsRepository';
import { RoundPlayedCardsRepository } from './RoundPlayedCardsRepository';

export function RoundPlayedCardsRepositoryFactory(): IRoundPlayedCardsRepository {
  return new RoundPlayedCardsRepository();
}
