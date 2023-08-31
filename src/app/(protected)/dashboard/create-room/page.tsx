import { DashboardBreadcrumbs } from '@/components/dashboard/dashboard-breadcrumbs';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { NewRoomCardForm } from '@/components/new-room-card-form';
import { Plus } from 'lucide-react';

export default async function CreateRoomPage() {
  return (
    <section className="flex flex-col gap-16 w-full max-w-5xl">
      <div className="flex flex-col gap-6">
        <DashboardBreadcrumbs />

        <DashboardPageHeader
          title="Criar uma nova sala"
          subtitle="Algum subtítulo que o nosso qualificado time de desenvolvedores não pensou... Quer saber, use sua imaginação!"
          icon={<Plus size={24} />}
        />
      </div>

      <NewRoomCardForm />
    </section>
  );
}
