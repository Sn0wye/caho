import { PublicGameRoomCardSkeleton } from './_components/public-game-room-card-skeleton';

export default function ListGamesLoadingScreen() {
  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <PublicGameRoomCardSkeleton />
      <PublicGameRoomCardSkeleton />
      <PublicGameRoomCardSkeleton />
      <PublicGameRoomCardSkeleton />
      <PublicGameRoomCardSkeleton />
    </section>
  );
}
