import { PublicGameRoomCard } from '@/components/public-game-room-card';

export default function ListGamesLoadingScreen() {
  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <PublicGameRoomCard.Skeleton />
      <PublicGameRoomCard.Skeleton />
      <PublicGameRoomCard.Skeleton />
      <PublicGameRoomCard.Skeleton />
    </section>
  );
}
