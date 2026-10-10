import type { RoomStatus } from '@/schemas';

export const GAME_STATUSES_DICTIONARY: { [key in RoomStatus]: string } = {
  LOBBY: 'Planejando a baixaria',
  IN_PROGRESS: 'Pau torando',
  FINISHED: 'Acabou a baixaria'
} as const;

export const NEW_ROOM_FORM = {
  MIN_PLAYERS: 3,
  MAX_PLAYERS: 10
};

// One Judge plus at least two answers. Mirrors the backend's gameRules.ts.
export const MIN_PLAYERS_TO_START = 3;

// How long the round-result overlay stays up after a Round ends.
export const ROUND_RESULT_DISPLAY_MS = 6000;
