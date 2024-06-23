import { PublicRooms } from './_components/public-rooms';
import { getPublicRooms } from './getPublicRooms';

export default async function ListPublicRoomsPage() {
  const publicRooms = await getPublicRooms();

  return <PublicRooms initialData={publicRooms} />;
}
