import { Clerk, constants } from '@clerk/backend';
import type {
  ClerkOptions,
  SignedInAuthObject,
  SignedOutAuthObject
} from '@clerk/backend';
import { Elysia } from 'elysia';
import { env } from '@/env';

const API_URL = 'https://api.clerk.dev';
const API_VERSION = 'v1';
const SECRET_KEY = env.CLERK_SECRET_KEY || '';
const PUBLISHABLE_KEY = env.CLERK_PUBLISHABLE_KEY || '';

const clerk = Clerk({
  secretKey: SECRET_KEY,
  apiUrl: API_URL,
  apiVersion: API_VERSION
});

function clerkPlugin(options?: ClerkOptions) {
  const secretKey = options?.secretKey ?? SECRET_KEY;
  const publishableKey = options?.publishableKey ?? PUBLISHABLE_KEY;

  return new Elysia({
    name: 'clerk',
    seed: options
  })
    .state('auth', null as null | SignedInAuthObject | SignedOutAuthObject)
    .onBeforeHandle(async ({ request, set, store }) => {
      const requestState = await clerk.authenticateRequest({
        ...options,
        secretKey,
        publishableKey,
        request
      });

      if (requestState.isUnknown) {
        set.status = 401;
        set.headers = {
          [constants.Headers.AuthReason]: requestState.reason,
          [constants.Headers.AuthMessage]: requestState.message
        };
        return '';
      }

      if (requestState.isInterstitial) {
        const interstitialHtmlPage = clerk.localInterstitial({
          publishableKey,
          frontendApi: publishableKey
        });

        set.status = 401;
        set.headers = {
          [constants.Headers.AuthReason]: requestState.reason,
          [constants.Headers.AuthMessage]: requestState.message,
          'Content-Type': 'text/html'
        };

        return interstitialHtmlPage;
      }

      store.auth = requestState.toAuth();
    });
}

export { clerk, clerkPlugin, type ClerkOptions };
