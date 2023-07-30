import { AlertTopBar } from '@/components/alert-top-bar';
import { DashboardOptionCard } from '@/components/dashboard/dashboard-option-card';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { Navbar } from '@/components/navbar';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  return (
    <div className="flex h-full min-h-screen w-screen flex-col items-center">
      <Navbar />
      <AlertTopBar label="Essa joça tá em BETA. Não fode." />
      <main className="flex h-full w-full max-w-7xl grow flex-col gap-8 p-8">
        <DashboardPageHeader
          title="Olá, Fulano de Tal"
          subtitle="Algum subtítulo que o nosso qualificado time de desenvolvedores não
            pensou... Quer saber, use sua imaginação!"
        />

        <Separator className="w-full" />

        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <DashboardOptionCard
            title="Encontrar uma partida pública"
            description="Acredite se quiser, algumas pessoas tem coragem de deixar uma sala pública... Tente a sorte lá!"
            href="/games"
          />

          <DashboardOptionCard
            title="Entrar em uma partida com credenciais"
            description="Acredite se quiser, algumas pessoas tem coragem de deixar uma sala pública... Tente a sorte lá!"
            href="/games"
          />

          <DashboardOptionCard
            title="Criar uma nova partida"
            description="Acredite se quiser, algumas pessoas tem coragem de deixar uma sala pública... Tente a sorte lá!"
            href="/game/new"
            fillContainer
          />
        </section>
      </main>
    </div>
  );
}
