import { db } from '@/db';
import type { IRoundPlayedCardsRepository } from './IRoundPlayedCardsRepository';
import type { CreateRoundPlayedCardDTO } from '@/dto/CreateRoundPlayedCard';
import type { RoundPlayedCard } from '@caho/schemas';
import {} from 'drizzle-orm';
import { roundPlayedCards } from '@/db/schema';

export class RoundPlayedCardsRepository implements IRoundPlayedCardsRepository {
  private db: typeof db;

  constructor() {
    this.db = db;
  }

  public async create(
    data: CreateRoundPlayedCardDTO
  ): Promise<Omit<RoundPlayedCard, 'player' | 'whiteCards'>> {
    return (await this.db.insert(roundPlayedCards).values(data).returning())[0];
  }

  public async findByRoomCodeAndRoundNumber(
    roomCode: string,
    roundNumber: number
  ): Promise<RoundPlayedCard[]> {
    const round = await this.db.query.rounds.findFirst({
      where: (rounds, { and, eq }) =>
        and(eq(rounds.roomCode, roomCode), eq(rounds.roundNumber, roundNumber))
    });

    if (!round) {
      return [];
    }

    const roundPlayedCards = await this.db.query.roundPlayedCards.findMany({
      where: (roundPlayedCards, { eq }) =>
        eq(roundPlayedCards.roundId, round.id),
      with: {
        player: true,
        whiteCards: true
      }
    });

    return roundPlayedCards;
  }
}
