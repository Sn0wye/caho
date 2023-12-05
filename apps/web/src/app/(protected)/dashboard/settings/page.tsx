import { User } from 'lucide-react';
import {
  DashboardBreadcrumbs,
  type BreadcrumbType
} from '@/components/dashboard/dashboard-breadcrumbs';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
// import { SettingsProfileForm } from '@/components/dashboard/settings/settings-profile-form';
import { getUser } from '@/auth';

const breadcrumbs: BreadcrumbType[] = [
  {
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    label: 'Configurações',
    href: '/dashboard/settings'
  }
];

export default async function ProfileSettingsPage() {
  const user = await getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  return (
    <section className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-6">
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />

        <DashboardPageHeader
          title="Perfil"
          subtitle="Atualize suas informações pessoais do perfil."
          icon={<User size={24} />}
        />
      </div>

      {/* TODO: uncomment this */}
      {/* <SettingsProfileForm user={{ name, imageUrl: avatarUrl }} /> */}
    </section>
  );
}
