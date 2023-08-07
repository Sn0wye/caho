import { AlertTopBar } from '@/components/alert-top-bar';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { Navbar } from '@/components/navbar';
import { Separator } from '@/components/ui/separator';
import { createCaller } from '@/utils/caller';
import { Rooms } from './rooms';

export default async function ListGamesPage() {
  const caller = createCaller();
  const publicRooms = await caller.room.list();

  return (
    <div className="flex h-full min-h-screen w-screen flex-col items-center">
      <Navbar />
      <AlertTopBar label="Essa joça tá em BETA. Não trolla." />
      <main className="flex h-full w-full max-w-7xl grow flex-col gap-8 p-8">
        <DashboardPageHeader
          title="Encontrar uma partida pública"
          subtitle="Acredite se quiser, algumas pessoas tem coragem de deixar uma sala pública... Tente a sorte lá!"
          previousPageButton
        />

        <Separator className="w-full" />

        <Rooms initialData={publicRooms} />
      </main>
    </div>
  );
}
