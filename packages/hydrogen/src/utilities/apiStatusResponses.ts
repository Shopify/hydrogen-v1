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
    return new Response(this.message, {status: this.status});
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

export class TeapotError extends RestError {
  constructor(message: string, details: string) {
    super(message, 418, details);
  }
}
