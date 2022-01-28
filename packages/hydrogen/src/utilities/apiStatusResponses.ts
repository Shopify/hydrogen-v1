/**
 * API status response codes are implemented below using https://httpstatuses.com/ as a template. Developers can use
 * these functions by throwing them as an error. Each response has a default code that will be returned with it's
 * coresponding message. The message can be optionally changed as needed in the functions parameters and include any
 * optional details. If there is a response missing a developer can use RestStatusResponse instead.
 * */

const TYPE = '__REST_STATUS__';
const isDev = process.env.NODE_ENV === 'development';

interface Response {
  statusMessage: string,
  status: number
  details: string,
  stackTrace: any
}

export class RestStatusResponse extends Error {
  /**
   *  Cannot use typeof
   */
  static isRestStatusResponse(error: unknown) {
    if (!error) return false;
    return (error as RestStatusResponse).__type === TYPE;
  }

  __type = TYPE;
  status: number;
  details: string | undefined;

  constructor(status: number, message?: string, details?: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
  }

  getResponse() {
    let responseMessage = <Response>{
      statusMessage: this.message,
      status: this.status,
      details: this.details,
      stackTrace: null,
    };

    if(isDev) responseMessage = <Response>{
      statusMessage: this.message,
      status: this.status,
      details: this.details,
      stackTrace: this.stack
    }

    return new Response(JSON.stringify(responseMessage), {status: this.status});
  }
}

/*
 *   1×× Informational
 */

/* 1xx Status codes don't work very well when returned in a response to the client...*/

/*export class ContinueResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(100, (message ? message : 'Continue'),  details);
  }
}

export class SwitchingProtocolsResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(101, (message ? message : 'Switching Protocols'),  details);
  }
}

export class ProcessingResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(102, (message ? message : 'Processing'),  details);
  }
}

export class EarlyHintsResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(103, (message ? message : 'Early Hints'),  details);
  }
}*/

/*
 *   2×× Success
 */

export class OKResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(200, (message ? message : 'OK'),  details);
  }
}

export class CreatedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(201, (message ? message : 'Created'),  details);
  }
}

export class AcceptedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(202, (message ? message : 'Accepted'),  details);
  }
}

export class NonAuthorativeInformationResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(203, (message ? message : 'Non-Authorative Information'),  details);
  }
}

export class NoContentResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(204, (message ? message : 'No Content'),  details);
  }
}

export class ResetContentResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(205, (message ? message : 'Reset Content'),  details);
  }
}

export class PartialContentResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(206, (message ? message : 'Partial Content'),  details);
  }
}

export class MultiStatusResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(207, (message ? message : 'Multi-Status'),  details);
  }
}

export class AlreadyReportedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(208, (message ? message : 'Already Reported'),  details);
  }
}

export class IMUsedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(226, (message ? message : 'IM Used'),  details);
  }
}

/*
 *   3×× Redirection
 */

export class MultipleChoicesResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(300, (message ? message : 'Multiple Choices'),  details);
  }
}

export class MovedPermanentlyResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(301, (message ? message : 'Moved Permanently'),  details);
  }
}

export class FoundResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(302, (message ? message : 'Found'),  details);
  }
}

export class SeeOtherResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(303, (message ? message : 'See Other'),  details);
  }
}

export class NotModifiedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(304, (message ? message : 'Not Modified'),  details);
  }
}

export class UseProxyResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(306, (message ? message : 'Use Proxy'),  details);
  }
}

export class TemporaryRedirectResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(307, (message ? message : 'Temporary Redirect'),  details);
  }
}

export class PermanentRedirectResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(308, (message ? message : 'Permanent Redirect'),  details);
  }
}

/*
 *   4×× Client Error
 */


export class BadRequestResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(400, (message ? message : 'Bad Request'),  details);
  }
}

export class UnauthorizedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(401, (message ? message : 'Unauthorized'),  details);
  }
}

export class PaymentRequiredResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(402, (message ? message : 'Payment Required'),  details);
  }
}

export class ForbiddenResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(403, (message ? message : 'Forbidden'),  details);
  }
}

export class NotFoundResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(404, (message ? message : 'Not Found'),  details);
  }
}

export class MethodNotAllowedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(405, (message ? message : 'Method Not Allowed'),  details);
  }
}

export class NotAcceptableResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(406, (message ? message : 'Not Acceptable'),  details);
  }
}

export class ProxyAuthenticationRequiredResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(407, (message ? message : 'Proxy Authentication Required'),  details);
  }
}

export class RequestTimeoutResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(408, (message ? message : 'Request Timeout'),  details);
  }
}

export class ConflictResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(409, (message ? message : 'Conflict'),  details);
  }
}

export class GoneResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(410, (message ? message : 'Gone'),  details);
  }
}

export class LengthRequiredResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(411, (message ? message : 'Length Required'),  details);
  }
}

export class PreconditionFailedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(412, (message ? message : 'Precondition Failed'),  details);
  }
}

export class PayloadTooLargeResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(413, (message ? message : 'Payload Too Large'),  details);
  }
}

export class RequestURITooLongResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(414, (message ? message : 'Request URI Too Long'),  details);
  }
}

export class UnsupportedMediaTypeResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(415, (message ? message : 'Unsupported Media Type'),  details);
  }
}

export class RequestedRangeNotSatisfiableResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(416, (message ? message : 'Requested Range Not Satisfiable'),  details);
  }
}

export class ExpecationFailedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(417, (message ? message : 'Expecation Failed'),  details);
  }
}

export class TeapotResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(418, (message ? message : 'I\'m a teapot'),  details);
  }
}

export class MisdirectedRequestResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(421, (message ? message : 'MisdirectedRequest'),  details);
  }
}

export class UnprocessableEntityResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(422, (message ? message : 'Unprocessable Entity'),  details);
  }
}

export class LockedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(423, (message ? message : 'Locked'),  details);
  }
}

export class FailedDependencyResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(424, (message ? message : 'Failed Dependency'),  details);
  }
}

export class UpgradeRequiredResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(426, (message ? message : 'Upgrade Required'),  details);
  }
}

export class PreconditionRequiredResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(428, (message ? message : 'Precondition Required'),  details);
  }
}

export class TooManyRequestsResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(429, (message ? message : 'Too Many Requests'),  details);
  }
}

export class RequestHeaderFieldsTooLargeResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(431, (message ? message : 'Request Header Fields Too Large'),  details);
  }
}

export class ConnectionClosedWithoutResponseResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(444, (message ? message : 'Connection Closed Without Response'),  details);
  }
}

export class UnavailableForLegalReasonsResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(451, (message ? message : 'Unavailable For Legal Reasons'),  details);
  }
}

export class ClientClosedRequestResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(499, (message ? message : 'Client Closed Request'),  details);
  }
}

/*
 *   5×× Server Error
 */

export class UnknownResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(500, (message ? message : 'Unknown'),  details);
  }
}

export class NotImplementedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(501, (message ? message : 'Not Implemented'),  details);
  }
}

export class BadGatewayResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(502, (message ? message : 'Bad Gateway'),  details);
  }
}

export class ServiceUnavailableResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(503, (message ? message : 'Service Unavailable'),  details);
  }
}

export class GatewayTimeoutResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(504, (message ? message : 'Gateway Timeout'),  details);
  }
}

export class HTTPVersionNotSupportedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(505, (message ? message : 'HTTP Version Not Supported'),  details);
  }
}

export class VariantAlsoNegotiatesResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(506, (message ? message : 'Variant Also Negotiates'),  details);
  }
}

export class InsufficientStorageResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(507, (message ? message : 'Insufficient Storage'),  details);
  }
}

export class LoopDetectedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(508, (message ? message : 'Loop Detected'),  details);
  }
}

export class NotExtendedResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(510, (message ? message : 'Loop Detected'),  details);
  }
}

export class NetworkAuthenticationRequiredResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(511, (message ? message : 'Network Authentication Required'),  details);
  }
}

export class NetworkConnectTimeoutErrorResponse extends RestStatusResponse {
  constructor(message: string, details: string) {
    super(599, (message ? message : 'Network Connect Timeout Error'),  details);
  }
}

