'use server';

import { api } from '@/utils/server/api';
import type { ListRoomsResponse } from '@/contracts';

export const getRooms = async () => {
  const { data } = await api.get<ListRoomsResponse>('/rooms/list');
  return data;
};
