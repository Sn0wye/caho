import { Plus } from 'lucide-react';
import {
  DashboardBreadcrumbs,
  type BreadcrumbType
} from '@/components/dashboard/dashboard-breadcrumbs';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { NewRoomCardForm } from '@/components/new-room-card-form';

const breadcrumbs: BreadcrumbType[] = [
  {
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    label: 'Nova sala',
    href: '/dashboard/create-room'
  }
];

export default async function CreateRoomPage() {
  return (
    <section className="flex w-full max-w-3xl flex-col gap-16">
      <div className="flex flex-col gap-6">
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />

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
