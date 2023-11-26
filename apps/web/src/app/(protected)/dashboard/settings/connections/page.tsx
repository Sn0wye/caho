'use client';

// import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Server } from 'lucide-react';
import {
  DashboardBreadcrumbs,
  type BreadcrumbType
} from '@/components/dashboard/dashboard-breadcrumbs';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';

// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Skeleton } from '@/components/ui/skeleton';

dayjs.extend(relativeTime);

const breadcrumbs: BreadcrumbType[] = [
  {
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    label: 'Configurações',
    href: '/dashboard/settings'
  },
  {
    label: 'Dispositivos',
    href: '/dashboard/settings/connections'
  }
];

//TODO: refactor this page
export default function ConnectionsSettingsPage() {
  // const { user, isLoaded } = useUser();
  // const { session: currentSession } = useSession();

  // const { data = [], isLoading } = useQuery({
  //   queryKey: ['connections'],
  //   queryFn: async () => {
  //     return user?.getSessions();
  //   },
  //   enabled: isLoaded && !!user
  // });

  return (
    <section className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-6">
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />

        <DashboardPageHeader
          title="Dispositivos"
          subtitle="Gerencie os dispositivos conectados à sua conta."
          icon={<Server size={24} />}
        />
      </div>

      {/* {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      )} */}

      <div className="space-y-4">
        {/* {data.map(session => {
          const isCurrentSession = currentSession?.id === session.id;

          return (
            <Card
              className="flex h-28 items-center justify-between p-6"
              key={session.id}
            >
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2">
                  {session.latestActivity.deviceType} (
                  {session.latestActivity.browserName}){' '}
                  {isCurrentSession && (
                    <Badge variant="secondary">This device</Badge>
                  )}
                </span>
                <span className="text-muted-foreground text-sm">
                  Last active {dayjs(session.lastActiveAt).fromNow()}
                </span>
              </div>

              <Button variant="destructive" disabled={isCurrentSession}>
                Revoke access
              </Button>
            </Card>
          );
        })} */}
      </div>
    </section>
  );
}
