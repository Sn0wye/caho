import { createCaller } from '@/utils/caller';
import { Rooms } from './rooms';

export default async function ListPublicRoomsPage() {
  const caller = createCaller();
  const publicRooms = await caller.room.list();

  return <Rooms initialData={publicRooms} />;
}
