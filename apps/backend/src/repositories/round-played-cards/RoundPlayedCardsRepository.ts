import { db } from '@/db';
import type { IRoundPlayedCardsRepository } from './IRoundPlayedCardsRepository';
import type { CreateRoundPlayedCardDTO } from '@/dto/CreateRoundPlayedCard';
import type { RoundPlayedCard } from '@caho/schemas';
import { roundPlayedCards, roundPlayedCardWhiteCards } from '@/db/schema';
import { createId } from '@paralleldrive/cuid2';

export class RoundPlayedCardsRepository implements IRoundPlayedCardsRepository {
  private readonly db = db;

  public async create(
    data: CreateRoundPlayedCardDTO
  ): Promise<Omit<RoundPlayedCard, 'player' | 'whiteCards'>> {
    const [inserted] = await this.db
      .insert(roundPlayedCards)
      .values({
        id: createId(),
        roundId: data.roundId,
        playerId: data.playerId
      })
      .returning();

    if (!inserted) throw new Error('Failed to create round played card');

    await this.db.insert(roundPlayedCardWhiteCards).values(
      data.whiteCardIds.map(whiteCardId => ({
        id: createId(),
        roundPlayedCardId: inserted.id,
        whiteCardId
      }))
    );

    return {
      id: inserted.id,
      roundId: inserted.roundId,
      createdAt: inserted.createdAt,
      updatedAt: inserted.updatedAt
    };
  }

  public async findByRoomCodeAndRoundNumber(
    roomCode: string,
    roundNumber: number
  ): Promise<RoundPlayedCard[]> {
    const round = await this.db.query.rounds.findFirst({
      where: (rounds, { and, eq }) =>
        and(eq(rounds.roomCode, roomCode), eq(rounds.roundNumber, roundNumber))
    });

    if (!round) return [];

    const playedCards = await this.db.query.roundPlayedCards.findMany({
      where: (roundPlayedCards, { eq }) =>
        eq(roundPlayedCards.roundId, round.id),
      with: {
        player: true,
        whiteCards: {
          with: {
            whiteCard: true
          }
        }
      }
    });

    return playedCards.map(card => ({
      id: card.id,
      roundId: card.roundId,
      player: card.player,
      whiteCards: card.whiteCards.map(pivot => ({
        id: pivot.whiteCard.id,
        text: pivot.whiteCard.text,
        packId: pivot.whiteCard.packId
      })),
      createdAt: card.createdAt,
      updatedAt: card.updatedAt
    }));
  }
}
