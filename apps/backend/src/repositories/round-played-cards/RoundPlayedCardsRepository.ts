import { db } from '@/db';
import type { IRoundPlayedCardsRepository } from './IRoundPlayedCardsRepository';
import type { CreateRoundPlayedCardDTO } from '@/dto/CreateRoundPlayedCard';
import { roundPlayedCards } from '@/db/schema';
import type { RoundPlayedCard } from '@caho/schemas';

export class RoundPlayedCardsRepository implements IRoundPlayedCardsRepository {
  private db: typeof db;

  constructor() {
    this.db = db;
  }

  public async create(
    data: CreateRoundPlayedCardDTO
  ): Promise<RoundPlayedCard> {
    return (await this.db.insert(roundPlayedCards).values(data).returning())[0];
  }
}
