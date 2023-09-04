import { type Room } from '@caho/schemas';
import { api } from '@/utils/api';

export const getPublicRooms = async () => {
  const { data } = await api.get<Room[]>('/list');
  return data;
};
