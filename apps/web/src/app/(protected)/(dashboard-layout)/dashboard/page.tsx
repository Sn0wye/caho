import type { User } from '@caho/schemas';
import { Home, Plus, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getUser } from '@/auth/server';
import { DashboardPageHeader } from '../_components/dashboard-page-header';
import { DashboardBanner } from './_components/dashboard-banner';
import { DashboardOptionCard } from './_components/dashboard-option-card';
import { DashboardPrivateRoomModal } from './_components/dashboard-private-room-modal';

export default async function DashboardPage() {
  const user = (await getUser()) as User;
  const name = user.username;

  return (
    <section className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Dashboard"
        subtitle="Aqui você pode criar uma nova sala, entrar em uma sala com um código ou encontrar uma sala pública."
        icon={<Home size={24} />}
      />
      <Separator className="w-full" />
      <DashboardBanner firstName={name || 'DESCONHECIDO'} />

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
