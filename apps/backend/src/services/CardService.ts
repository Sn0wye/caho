import type { BlackCard, CardPack, WhiteCard } from '@/cards/base-pack';
import { db } from '@/db';
import { rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';

export class CardService {
  private readonly roomCode: string;
  private readonly cardPacks: CardPack[];
  private readonly db: typeof db;

  constructor(roomCode: string, cardPacks: CardPack | CardPack[]) {
    if (!Array.isArray(cardPacks)) {
      // biome-ignore lint/style/noParameterAssign: this.cardPacks should be an array
      cardPacks = [cardPacks];
    }
    this.cardPacks = cardPacks;
    this.roomCode = roomCode;
    this.db = db;
  }

  private async getRandomWhiteCards(
    cards: WhiteCard[],
    count: number
  ): Promise<WhiteCard[]> {
    const { pickedWhiteCards } = (
      await this.db
        .select({
          pickedWhiteCards: rooms.pickedWhiteCards
        })
        .from(rooms)
        .where(eq(rooms.code, this.roomCode))
        .limit(1)
        .execute()
    )[0];

    const availableCards = cards.filter(card => {
      return !pickedWhiteCards.includes(card.id);
    });

    const selectedCards: WhiteCard[] = [];

    while (selectedCards.length < count && availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const selectedCard = availableCards.splice(randomIndex, 1)[0];
      selectedCards.push(selectedCard);
    }

    await this.db
      .update(rooms)
      .set({
        pickedWhiteCards: [
          ...pickedWhiteCards,
          ...selectedCards.map(card => card.id)
        ]
      })
      .where(eq(rooms.code, this.roomCode))
      .execute();

    return selectedCards;
  }

  private async getRandomBlackCard(cards: BlackCard[]): Promise<BlackCard> {
    const { pickedBlackCards } = (
      await this.db
        .select({
          pickedBlackCards: rooms.pickedBlackCards
        })
        .from(rooms)
        .where(eq(rooms.code, this.roomCode))
        .limit(1)
        .execute()
    )[0];

    const availableCards = cards.filter(card => {
      return !pickedBlackCards.includes(card.id);
    });

    const randomIndex = Math.floor(Math.random() * availableCards.length);

    const selectedCard = availableCards[randomIndex];

    await this.db
      .update(rooms)
      .set({
        pickedBlackCards: [...pickedBlackCards, selectedCard.id],
        currentBlackCardId: selectedCard.id
      })
      .where(eq(rooms.code, this.roomCode))
      .execute();

    return selectedCard;
  }

  public async getNewWhiteCards(count = 1): Promise<WhiteCard[]> {
    const allWhiteCards = this.cardPacks.flatMap(pack => pack.cards.white);
    return this.getRandomWhiteCards(allWhiteCards, count);
  }

  public async getWhiteCardById(id: string): Promise<WhiteCard | undefined> {
    const allWhiteCards = this.cardPacks.flatMap(pack => pack.cards.white);
    return allWhiteCards.find(card => card.id === id);
  }

  public async getNewBlackCard(): Promise<BlackCard> {
    const allBlackCards = this.cardPacks.flatMap(pack => pack.cards.black);
    return this.getRandomBlackCard(allBlackCards);
  }

  public async getBlackCardById(id: string): Promise<BlackCard | undefined> {
    const allBlackCards = this.cardPacks.flatMap(pack => pack.cards.black);
    return allBlackCards.find(card => card.id === id);
  }

  public async resetDeck(): Promise<void> {
    await this.db
      .update(rooms)
      .set({ pickedWhiteCards: [], pickedBlackCards: [] })
      .where(eq(rooms.code, this.roomCode))
      .execute();
  }
}
