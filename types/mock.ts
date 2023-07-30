export type MockPlayer = {
  isHost: boolean;
  isJudge: boolean;
  name: string;
  score: number;
  avatarSrc: string;
  initials: string;
  isConnected: boolean;
};

export type MockPlayers = MockPlayer[];
