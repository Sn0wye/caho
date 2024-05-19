import { UnauthorizedError } from '@/errors';
import type { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

export const ensureAuth = fastifyPlugin(
  async (app: FastifyInstance) => {
    app.addHook('preHandler', async (req, res) => {
      const user = req.getUser();
      const session = req.getSession();

      if (!user || !session) {
        throw new UnauthorizedError();
      }
      return;
    });
  },
  { name: 'ensure-auth', fastify: '4.x' }
);
