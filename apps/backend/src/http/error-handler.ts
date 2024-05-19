import {
  BadRequestError,
  UnauthorizedError,
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError
} from '@/errors';
import type { FastifyInstance } from 'fastify';

export const fastifyErrorHandler: FastifyInstance['errorHandler'] = (
  error,
  _req,
  res
) => {
  // if (error instanceof ZodError) {

  //   reply.status(400).send({
  //     message: 'Validation error',
  //     errors: error.flatten().fieldErrors
  //   });
  // }

  if (error instanceof BadRequestError) {
    res.badRequest(error.message);
  }

  if (error instanceof UnauthorizedError) {
    res.unauthorized(error.message);
  }

  if (error instanceof NotFoundError) {
    res.notFound(error.message);
  }

  if (error instanceof UnprocessableEntityError) {
    res.unprocessableEntity(error.message);
  }

  if (error instanceof InternalServerError) {
    res.internalServerError(error.message);
  }

  console.error(error);

  res.internalServerError(error.message);
};
