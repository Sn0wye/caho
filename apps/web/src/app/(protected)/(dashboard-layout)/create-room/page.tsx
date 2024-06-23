import { Plus } from 'lucide-react';
import { DashboardPageHeader } from '../_components/dashboard-page-header';
import { NewRoomCardForm } from './_components/new-room-card-form';

export default async function CreateRoomPage() {
  return (
    <section className="flex w-full max-w-3xl flex-col gap-16">
      <DashboardPageHeader
        title="Criar uma nova sala"
        subtitle="Algum subtítulo que o nosso qualificado time de desenvolvedores não pensou... Quer saber, use sua imaginação!"
        icon={<Plus size={24} />}
      />

      <NewRoomCardForm />
    </section>
  );
}
