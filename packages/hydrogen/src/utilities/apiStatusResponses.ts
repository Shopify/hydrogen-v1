export class RestError extends Error {
    status: number;
    details: string;

    constructor(message: string, status: number, details: string) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.details = details;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RestError.prototype)
    };

    getResponse() {
        return new Response(this.message, { status: this.status });
    };

    getStatus() {
        return this.status;
    };

    getDetails() {
        return this.details;
    };

    getMessage() {
        return this.message;
    };
};

export class BadRequestError extends RestError {
    constructor(message: string, details: string) {
        super(message, 400, details);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BadRequestError.prototype)
    };
};

export class UnauthorizedError extends RestError {
    constructor(message: string, details: string) {
        super(message, 401, details);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    };
};


export class TeapotError extends RestError {
    constructor(message: string, details: string) {
        super(message, 418, details);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, TeapotError.prototype)
    };
};

