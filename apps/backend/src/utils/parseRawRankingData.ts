export function parseRawRankingData(input: string[]): Record<string, number> {
  const playerScores: Record<string, number> = {};

  for (let i = 0; i < input.length; i += 2) {
    const playerId = input[i];
    const score = Number(input[i + 1]);

    playerScores[playerId] = score;
  }

  return playerScores;
}
