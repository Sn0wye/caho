import { getPublicRooms } from './getPublicRooms';
import { Rooms } from './rooms';

export default async function ListPublicRoomsPage() {
  const publicRooms = await getPublicRooms();

  return <Rooms initialData={publicRooms} />;
}
