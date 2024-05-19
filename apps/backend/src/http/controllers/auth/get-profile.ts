import { getProfileResponse } from '@caho/contracts';
import { errorSchema } from '@caho/schemas';
import type { FastifyInstance } from 'fastify';

export const getProfileController = async (app: FastifyInstance) => {
  app.get(
    '/profile',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Get logged user profile',
        response: {
          200: getProfileResponse,
          401: errorSchema
        }
      }
    },
    req => {
      return req.getUser();
    }
  );
};
