import type { Player } from '@caho/schemas';

export const getRandomJudge = (
  prevJudgeId: string | null,
  players: Player[]
): string => {
  const playersWithoutPrevJudge = players.filter(p => p.id !== prevJudgeId);

  const randomIndex = Math.floor(
    Math.random() * playersWithoutPrevJudge.length
  );

  return playersWithoutPrevJudge[randomIndex].id;
};
