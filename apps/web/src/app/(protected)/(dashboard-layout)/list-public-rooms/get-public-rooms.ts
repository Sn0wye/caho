'use server';

import type { ListPublicRoomsResponse } from '@caho/contracts';
import { api } from '@/utils/server/api';

export const getPublicRooms = async () => {
  const { data } = await api.get<ListPublicRoomsResponse[]>('/rooms/list');
  return data;
};
