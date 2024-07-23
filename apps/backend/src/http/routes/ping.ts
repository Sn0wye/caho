import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

export const pingRoute = async (app: FastifyInstance) => {
  app.get(
    '/ping',
    {
      schema: {
        tags: ['Health'],
        description: 'Health check',
        response: {
          200: z.object({
            message: z.string()
          })
        }
      }
    },
    (_req, res) => {
      return res.send({
        message: 'pong'
      });
    }
  );
};
