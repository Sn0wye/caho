import { AlertTopBar } from '@/components/alert-top-bar';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { Navbar } from '@/components/navbar';
import { PublicGameRoomCard } from '@/components/public-game-room-card';
import { PublicGameRoomCardSkeleton } from '@/components/skeletons/public-game-room-card-skeleton';
import { Separator } from '@/components/ui/separator';
import { mockPublicRooms } from '@/mock/rooms';

export default function ListGamesPage() {
  return (
    <div className="flex h-full min-h-screen w-screen flex-col items-center">
      <Navbar />
      <AlertTopBar label="Essa joça tá em BETA. Não fode." />
      <main className="flex h-full w-full max-w-7xl grow flex-col gap-8 p-8">
        <DashboardPageHeader
          title="Encontrar uma partida pública"
          subtitle="Acredite se quiser, algumas pessoas tem coragem de deixar uma sala pública... Tente a sorte lá!"
          previousPageButton
        />

        <Separator className="w-full" />

        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mockPublicRooms.map(room => (
            <PublicGameRoomCard key={room.roomCode} {...room} />
          ))}
          <PublicGameRoomCardSkeleton />
        </section>
      </main>
    </div>
  );
}