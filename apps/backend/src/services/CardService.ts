import {
  type BlackCard,
  type CardPack,
  type WhiteCard
} from '@/cards/base-pack';

export class CardService {
  private cardPacks: CardPack[];
  private pickedWhiteCards: Set<string>;
  private pickedBlackCards: Set<string>;

  constructor(cardPacks: CardPack | CardPack[]) {
    if (!Array.isArray(cardPacks)) {
      cardPacks = [cardPacks];
    }
    this.cardPacks = cardPacks;
    this.pickedWhiteCards = new Set();
    this.pickedBlackCards = new Set();
  }

  private getRandomCards<T extends WhiteCard | BlackCard>(
    cards: T[],
    pickedCards: Set<string>,
    count: number
  ): T[] {
    const availableCards = cards.filter(card => !pickedCards.has(card.text));
    const selectedCards: T[] = [];

    while (selectedCards.length < count && availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const selectedCard = availableCards.splice(randomIndex, 1)[0];
      pickedCards.add(selectedCard.text);
      selectedCards.push(selectedCard);
    }

    return selectedCards;
  }

  public getNewWhiteCards(count: number = 1): WhiteCard[] {
    const allWhiteCards = this.cardPacks.flatMap(pack => pack.cards.white);
    return this.getRandomCards(allWhiteCards, this.pickedWhiteCards, count);
  }

  public getNewBlackCards(count: number = 1): BlackCard[] {
    const allBlackCards = this.cardPacks.flatMap(pack => pack.cards.black);
    return this.getRandomCards(allBlackCards, this.pickedBlackCards, count);
  }

  public resetDeck(): void {
    this.pickedWhiteCards.clear();
    this.pickedBlackCards.clear();
  }
}
