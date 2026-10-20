// @ts-check
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// NEXT_PUBLIC_* values are inlined at build time, so a production deploy built
// with the local defaults would send every request to the user's own machine.
const publicBackendUrl = z
  .string()
  .url()
  .refine(
    url =>
      process.env.VERCEL_ENV !== 'production' ||
      !['localhost', '127.0.0.1'].includes(new URL(url).hostname),
    'Production builds must point at the deployed backend, not localhost'
  );

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    // Proves to the backend that a forwarded player IP came from this server.
    // Must equal the backend's FRONTEND_PROXY_SECRET. Unset: no IP is forwarded.
    BACKEND_PROXY_SECRET: z.string().min(32).optional()
  },
  client: {
    NEXT_PUBLIC_BACKEND_URL: publicBackendUrl,
    NEXT_PUBLIC_WEBSOCKET_URL: publicBackendUrl
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    BACKEND_PROXY_SECRET: process.env.BACKEND_PROXY_SECRET || undefined,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION
});
