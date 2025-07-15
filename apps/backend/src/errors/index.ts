export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApplicationError {}
export class ForbiddenError extends ApplicationError {}

export class UnauthorizedError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Unauthorized');
  }
}

export class NotFoundError extends ApplicationError {}

export class UnprocessableEntityError extends ApplicationError {}

export class InternalServerError extends ApplicationError {}
