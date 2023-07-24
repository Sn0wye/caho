'use client';

import * as React from 'react';
import { api } from '@/utils/api';

export const ProvidersComponent = ({ children }: React.PropsWithChildren) => {
  return <>{children}</>;
};

export const Providers = api.withTRPC(
  ProvidersComponent
) as React.ComponentType<React.PropsWithChildren>;
