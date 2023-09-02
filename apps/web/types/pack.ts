export type CardPack = {
  id: string;
  name: string;
  official: boolean;
  cards: Cards;
};

export type Cards = {
  white: WhiteCard[];
  black: BlackCard[];
};

export type WhiteCard = {
  text: string;
  packId: string;
};

export type BlackCard = {
  text: string;
  pick: number;
  packId: string;
};
