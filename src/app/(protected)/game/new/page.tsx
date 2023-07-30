import { AlertTopBar } from '@/components/alert-top-bar';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { Navbar } from '@/components/navbar';
import { NewGameCardForm } from '@/components/new-game-card-form';
import { Separator } from '@/components/ui/separator';

export default async function CreateNewGamePage() {
  return (
    <div className="flex h-full min-h-screen w-screen flex-col items-center">
      <Navbar />
      <AlertTopBar label="Essa joça tá em BETA. Não fode." />
      <main className="flex h-full w-full max-w-7xl grow flex-col gap-8 p-8">
        <DashboardPageHeader
          title="Criar uma nova partida"
          subtitle="Algum subtítulo que o nosso qualificado time de desenvolvedores não pensou... Quer saber, use sua imaginação!"
          previousPageButton
        />

        <Separator className="w-full" />

        <NewGameCardForm />
      </main>
    </div>
  );
}
