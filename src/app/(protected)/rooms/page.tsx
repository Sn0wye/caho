import { AlertTopBar } from '@/components/alert-top-bar';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { Navbar } from '@/components/navbar';
import { PublicGameRoomCard } from '@/components/public-game-room-card';
import { Separator } from '@/components/ui/separator';
import { createCaller } from '@/utils/caller';

export default async function ListGamesPage() {
  const caller = createCaller();
  const publicRooms = await caller.room.list();

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
          {publicRooms.map(room => (
            <PublicGameRoomCard key={room.id} {...room} />
          ))}
        </section>
      </main>
    </div>
  );
}
