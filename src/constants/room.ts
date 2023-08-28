import { type GameStatuses } from 'types';

export const GAME_STATUSES_DICTIONARY: { [key in GameStatuses]: string } = {
  'LOBBY': 'Planejando a baixaria',
  'IN_PROGRESS': 'Pau torando',
  'FINISHED': 'Acabou a baixaria'
} as const;

export const NEW_ROOM_FORM = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 10,
};