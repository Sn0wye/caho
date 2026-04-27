import { User } from 'lucide-react';
import { DashboardPageHeader } from '../_components/dashboard-page-header';
import { SettingsProfileForm } from './_components/settings-profile-form';

export default async function ProfileSettingsPage() {
  return (
    <section className="flex w-full flex-col gap-12">
      <DashboardPageHeader
        title="Perfil"
        subtitle="Atualize suas informações pessoais do perfil."
        icon={<User size={24} />}
      />

      <SettingsProfileForm />
    </section>
  );
}
