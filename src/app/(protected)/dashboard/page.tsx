import { DashboardBanner } from '@/components/dashboard/dashboard-banner';
import { DashboardOptionCard } from '@/components/dashboard/dashboard-option-card';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { DashboardPrivateRoomModal } from '@/components/dashboard/dashboard-private-room-modal';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@clerk/nextjs';
import { Home, Plus, Search } from 'lucide-react';

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <section className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Dashboard"
        subtitle="Aqui você pode criar uma nova sala, entrar em uma sala com um código ou encontrar uma sala pública."
        icon={<Home size={24} />}
      />
      <Separator className="w-full" />
      <DashboardBanner firstName={user?.firstName || 'DESCONHECIDO'} />

      <section className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-3">
        <DashboardOptionCard
          title="Criar uma nova partida"
          description="Minha sala, minhas regras!"
          href="/dashboard/create-room"
          bgColor="teal"
          icon={<Plus />}
        />

        <DashboardPrivateRoomModal />

        <DashboardOptionCard
          title="Encontrar uma partida pública"
          description="Algumas pessoas tem coragem de deixar uma sala pública... Tente a sorte lá!"
          href="/dashboard/list-public-rooms"
          bgColor="yellow"
          icon={<Search />}
        />
      </section>
    </section>
  );
}
