import type { App } from '@/app';
import { getProfileResponse } from '@caho/contracts';
import { errorSchema } from '@caho/schemas';

export const getProfileController = async (app: App) => {
  app.get(
    '/profile',
    {
      schema: {
        response: {
          200: getProfileResponse,
          401: errorSchema
        }
      }
    },
    async (req, res) => {
      if (!req.session || !req.user) {
        return res.unauthorized();
      }

      return req.user;
    }
  );
};
