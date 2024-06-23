import { PublicRooms } from './_components/public-rooms';
import { getPublicRooms } from './get-public-rooms';

export default async function ListPublicRoomsPage() {
  const publicRooms = await getPublicRooms();

  return <PublicRooms initialData={publicRooms} />;
}
