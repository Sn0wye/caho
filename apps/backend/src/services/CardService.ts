import { type Redis } from 'ioredis';
import {
  type BlackCard,
  type CardPack,
  type WhiteCard
} from '@/cards/base-pack';

export class CardService {
  private readonly redis: Redis;
  private readonly roomCode: string;
  private readonly cardPacks: CardPack[];

  constructor(
    redis: Redis,
    roomCode: string,
    cardPacks: CardPack | CardPack[]
  ) {
    if (!Array.isArray(cardPacks)) {
      cardPacks = [cardPacks];
    }
    this.cardPacks = cardPacks;
    this.roomCode = roomCode;
    this.redis = redis;
  }

  private async getRandomCards<T extends WhiteCard | BlackCard>(
    cards: T[],
    cardType: 'white' | 'black',
    count: number
  ): Promise<T[]> {
    const pickedCardsKey = `${this.roomCode}:${cardType}:pickedCards`;
    const availableCards = cards.filter(async card => {
      const isPicked = await this.redis.sismember(pickedCardsKey, card.text);
      return isPicked === 0;
    });
    const selectedCards: T[] = [];

    while (selectedCards.length < count && availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const selectedCard = availableCards.splice(randomIndex, 1)[0];
      await this.redis.sadd(pickedCardsKey, selectedCard.id);
      selectedCards.push(selectedCard);
    }

    return selectedCards;
  }

  public async getNewWhiteCards(count: number = 1): Promise<WhiteCard[]> {
    const allWhiteCards = this.cardPacks.flatMap(pack => pack.cards.white);
    return this.getRandomCards(allWhiteCards, 'white', count);
  }

  public async getNewBlackCards(count: number = 1): Promise<BlackCard[]> {
    const allBlackCards = this.cardPacks.flatMap(pack => pack.cards.black);
    return this.getRandomCards(allBlackCards, 'black', count);
  }

  public async resetDeck(): Promise<void> {
    const whiteCardsKey = `${this.roomCode}:white:pickedCards`;
    const blackCardsKey = `${this.roomCode}:black:pickedCards`;
    await this.redis.del(whiteCardsKey, blackCardsKey);
  }
}
