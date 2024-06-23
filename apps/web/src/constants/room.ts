import type { RoomStatus } from '@caho/schemas';

export const GAME_STATUSES_DICTIONARY: { [key in RoomStatus]: string } = {
  LOBBY: 'Planejando a baixaria',
  IN_PROGRESS: 'Pau torando',
  FINISHED: 'Acabou a baixaria'
} as const;

export const NEW_ROOM_FORM = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 10
};
