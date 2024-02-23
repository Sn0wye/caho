import { fastifyPlugin } from 'fastify-plugin';
import { verifyRequestOrigin } from 'lucia';
import { type App } from '@/app';

type Options = {
  enabled: boolean;
};

export const csrfPlugin = fastifyPlugin(
  async (app: App, opts: Options) => {
    if (!opts.enabled) {
      return;
    }

    app.addHook('preHandler', (req, res, done) => {
      if (req.method === 'GET') {
        return done();
      }

      const originHeader = req.headers.origin ?? null;
      // NOTE: You may need to use `X-Forwarded-Host` instead
      const hostHeader = req.headers.host ?? null;
      if (
        !originHeader ||
        !hostHeader ||
        !verifyRequestOrigin(originHeader, [hostHeader])
      ) {
        // TODO: verify this
        console.error('Invalid origin', { originHeader, hostHeader });
        return res.status(403);
      }
    });
  },
  {
    name: 'csrf',
    fastify: '4.x'
  }
);
