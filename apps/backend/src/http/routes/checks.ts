import { db } from '@/db';
import { sql } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

export const checkRoutes = async (app: FastifyInstance) => {
  app.get(
    '/readyz',
    {
      schema: {
        tags: ['Health'],
        description: 'Check if server, database and redis are ready',
        response: {
          200: z.object({
            message: z.literal('ok'),
            services: z.object({
              http: z.boolean(),
              db: z.boolean(),
              redis: z.boolean()
            })
          }),
          503: z.object({
            message: z.string(),
            services: z.object({
              http: z.boolean(),
              db: z.boolean(),
              redis: z.boolean()
            })
          })
        }
      }
    },
    async (_req, res) => {
      const healthStatus = {
        http: true,
        db: true,
        redis: true
      };

      try {
        try {
          await db.execute(sql`SELECT 1`);
        } catch (dbError) {
          console.log(dbError);
          healthStatus.db = false;
        }

        try {
          await redis.ping();
        } catch (redisError) {
          healthStatus.redis = false;
        }

        // If all services are okay
        if (healthStatus.db && healthStatus.redis) {
          return res.send({
            message: 'ok',
            services: healthStatus
          });
        }

        return res.status(503).send({
          message: 'Service Unavailable',
          services: healthStatus
        });
      } catch (err) {
        // In case any unhandled error happens
        return res.status(503).send({
          message: 'Service Unavailable',
          services: healthStatus
        });
      }
    }
  );
};
