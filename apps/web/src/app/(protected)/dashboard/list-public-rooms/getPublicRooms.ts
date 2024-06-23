'use server';

import type { Room } from '@caho/schemas';
import { api } from '@/utils/server/api';

export const getPublicRooms = async () => {
  const { data } = await api.get<Room[]>('/rooms/list');
  return data;
};
