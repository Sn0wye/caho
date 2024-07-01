export type JoinRoomDTO = {
  roomCode: string;
  password: string | null;
  player: {
    id: string;
    username: string;
    avatarUrl: string | null;
    isHost: boolean;
    isReady: boolean;
    isJudge: boolean;
    score: number;
    cardIds: string[];
  };
};
