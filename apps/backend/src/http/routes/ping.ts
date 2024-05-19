import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

export const pingRoute = async (app: FastifyInstance) => {
  app.get(
    '/ping',
    {
      schema: {
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
