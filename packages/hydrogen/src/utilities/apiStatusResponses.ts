const TYPE = '__REST_ERROR__';

export class RestError extends Error {
  /**
   *  Cannot use typeof
   */
  static isRestError(error: unknown) {
    if (!error) return false;
    return (error as RestError).__type === TYPE;
  }

  __type = TYPE;
  status: number;
  details: string;

  constructor(message: string, status: number, details: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
  }

  getResponse() {
    return new Response(JSON.stringify({error: this.message, details: this.details}), {status: this.status, statusText: this.message});
  }
}

export class BadRequestError extends RestError {
  constructor(message: string, details: string) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends RestError {
  constructor(message: string, details: string) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends RestError {
  constructor(message: string, details: string) {
    super(message, 403, details)
  }
}

export class NotFoundError extends RestError {
  constructor(message: string, details: string) {
    super(message, 404, details)
  }
}

export class MethodNotAllowedError extends RestError {
  constructor(message: string, details: string) {
    super(message, 405, details)
  }
}

export class UnknownError extends RestError {
  constructor(message: string, details: string) {
    super(message, 500, details)
  }
}

export class ExternalServiceError extends RestError {
  constructor(message: string, details: string) {
    super(message, 503, details)
  }
}

export class TeapotError extends RestError {
  constructor(message: string, details: string) {
    super(message, 418, details);
  }
}
