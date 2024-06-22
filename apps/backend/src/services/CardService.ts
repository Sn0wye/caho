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

  private async getRandomCards<T extends WhiteCard | BlackCard>(
    cards: T[],
    cardType: 'white' | 'black',
    count: number
  ): Promise<T[]> {
    const { pickedWhiteCards, pickedBlackCards } = (
      await this.db
        .select({
          pickedWhiteCards: rooms.pickedWhiteCards,
          pickedBlackCards: rooms.pickedBlackCards
        })
        .from(rooms)
        .where(eq(rooms.code, this.roomCode))
        .limit(1)
        .execute()
    )[0];

    const availableCards = cards.filter(card => {
      if (cardType === 'white') {
        return !pickedWhiteCards.includes(card.id);
      }
      return !pickedBlackCards.includes(card.id);
    });

    const selectedCards: T[] = [];

    while (selectedCards.length < count && availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const selectedCard = availableCards.splice(randomIndex, 1)[0];
      selectedCards.push(selectedCard);
    }

    if (cardType === 'white') {
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
    } else if (cardType === 'black') {
      await this.db
        .update(rooms)
        .set({
          pickedBlackCards: [
            ...pickedBlackCards,
            ...selectedCards.map(card => card.id)
          ]
        })
        .where(eq(rooms.code, this.roomCode))
        .execute();
    }

    return selectedCards;
  }

  public async getNewWhiteCards(count = 1): Promise<WhiteCard[]> {
    const allWhiteCards = this.cardPacks.flatMap(pack => pack.cards.white);
    return this.getRandomCards(allWhiteCards, 'white', count);
  }

  public async getWhiteCardById(id: string): Promise<WhiteCard | undefined> {
    const allWhiteCards = this.cardPacks.flatMap(pack => pack.cards.white);
    return allWhiteCards.find(card => card.id === id);
  }

  public async getNewBlackCards(count = 1): Promise<BlackCard[]> {
    const allBlackCards = this.cardPacks.flatMap(pack => pack.cards.black);
    return this.getRandomCards(allBlackCards, 'black', count);
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
