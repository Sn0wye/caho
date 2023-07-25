export interface Pack {
  id: string
  name: string
  official: boolean
  cards: Cards
}

export interface Cards {
  white: WhiteCard[]
  black: BlackCard[]
}

export interface WhiteCard {
  text: string
  packId: string
}

export interface BlackCard {
  text: string
  pick: number
  packId: string
}
