import type { CreateRoundPlayedCardDTO } from '@/dto/CreateRoundPlayedCard';
import type { RoundPlayedCard } from '@caho/schemas';

export interface IRoundPlayedCardsRepository {
  create(data: CreateRoundPlayedCardDTO): Promise<RoundPlayedCard>;
}
