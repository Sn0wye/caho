import type { CreateRoomDTO } from '@/dto/CreateRoom';
import type { JoinRoomDTO } from '@/dto/JoinRoom';
import type { LeaveRoomDTO } from '@/dto/LeaveRoom';
import type {
  BlackCard,
  Player,
  PublicRoomWithPlayerCountAndHost,
  Ranking,
  Room,
  Round,
  RoundPlayedCard,
  RoundWithRelations,
  WhiteCard
} from '@caho/schemas';

export interface IRoomService {
  getRoom(roomCode: string): Promise<Room>;
  createRoom(room: CreateRoomDTO): Promise<Room>;
  listPublicRooms(): Promise<PublicRoomWithPlayerCountAndHost[]>;
  addPlayerToRoom(input: { roomCode: string; player: Player }): Promise<void>;
  startRoom(roomCode: string): Promise<void>;
  endRoom(roomCode: string): Promise<Ranking>;
  joinRoom(input: JoinRoomDTO): Promise<Room>;
  leaveRoom(input: LeaveRoomDTO): Promise<void>;
  getRoomPlayers(roomCode: string): Promise<Player[]>;
  getRoomBlackCardId(roomCode: string): Promise<string | null>;
  updatePlayerInRoom(
    roomCode: string,
    playerId: string,
    payload: Partial<Player>
  ): Promise<Player>;
  getPlayerFromRoom(roomCode: string, playerId: string): Promise<Player>;
  incrementPlayerScore(input: {
    roomCode: string;
    playerId: string;
    by: number;
  }): Promise<void>;
  updateRoom(roomCode: string, data: Partial<Room>): Promise<Room>;
  getCurrentWhiteCards(
    roomCode: string,
    playerId: string
  ): Promise<WhiteCard[]>;
  setPlayersAsUnready(roomCode: string): Promise<void>;
  playCards(
    roomCode: string,
    playerId: string,
    playedCardIds: string[]
  ): Promise<WhiteCard[]>;
  createRound(data: CreateRoundDTO): Promise<Round>;
  startNextRound(
    roomCode: string,
    currentRound: number
  ): Promise<RoundWithRelations & { blackCard: BlackCard }>;
  getRoundPlayedCards(
    roomCode: string,
    roundNumber: number
  ): Promise<RoundPlayedCard[]>;
  getRoundNumber(roomCode: string): Promise<number>;
  judgeChooseWinner(data: JudgeChooseWinnerDTO): Promise<RoundPlayedCard>;
  processJudgeChooseWinner(data: JudgeChooseWinnerDTO): Promise<{
    room: Room;
    winner: RoundPlayedCard;
  }>;
  dealCardsToNonJudgePlayers(data: {
    roomCode: string;
    judgeId: string;
    cardsPerPlayer: number;
  }): Promise<
    {
      playerId: string;
      cards: WhiteCard[];
    }[]
  >;
}

export type JudgeChooseWinnerDTO = {
  winnerPlayerId: string;
  judgePlayerId: string;
  roomCode: string;
};
