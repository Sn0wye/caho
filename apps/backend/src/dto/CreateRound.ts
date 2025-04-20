type CreateRoundDTO = {
  roomCode: string;
  roundNumber: number;
  blackCardId: string;
  judgeId: string;
  roundWinnerId: string | null;
};
