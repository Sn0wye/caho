import { RoomList } from './_components/room-list';
import { getRooms } from './get-rooms';

export default async function RoomsPage() {
  const rooms = await getRooms();

  return <RoomList initialData={rooms} />;
}
