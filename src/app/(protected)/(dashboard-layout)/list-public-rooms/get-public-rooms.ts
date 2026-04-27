'use server';

import { api } from '@/utils/server/api';
import type { ListPublicRoomsResponse } from '@/contracts';

export const getPublicRooms = async () => {
  const { data } = await api.get<ListPublicRoomsResponse>('/rooms/list');
  return data;
};
