import { RoomListCardSkeleton } from './_components/room-list-card-skeleton';

export default function ListGamesLoadingScreen() {
  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <RoomListCardSkeleton />
      <RoomListCardSkeleton />
      <RoomListCardSkeleton />
      <RoomListCardSkeleton />
      <RoomListCardSkeleton />
    </section>
  );
}
