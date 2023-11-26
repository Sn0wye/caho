import { playerSchema, type Player } from '@caho/schemas';

export function transformRankingData(input: (object | number)[]) {
  return input.reduce<Player[]>((result, item) => {
    if (typeof item === 'object' && item !== null) {
      // Object entry (player)
      result.push({ ...playerSchema.parse(item), score: 0 }); // Assuming a default score of 0
    } else if (typeof item === 'number') {
      // Number entry (score)
      if (result.length > 0) {
        // Attach the score to the last player
        result[result.length - 1].score = item;
      }
    }
    return result;
  }, []);
}

export function transformStringRankingData(input: string[]) {
  return input.reduce<Player[]>((result, item, index) => {
    if (index % 2 === 0) {
      // Object entry (player)
      result.push({ ...playerSchema.parse(JSON.parse(item)), score: 0 }); // Assuming a default score of 0
    } else {
      // Number entry (score)
      if (result.length > 0) {
        // Attach the score to the last player
        result[result.length - 1].score = Number(item);
      }
    }
    return result;
  }, []);
}
