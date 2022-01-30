import {
  /* 2×× Success */
  OKResponse,
  CreatedResponse,
  AcceptedResponse,
  NonAuthorativeInformationResponse,
  NoContentResponse,
  ResetContentResponse,
  PartialContentResponse,
  MultiStatusResponse,
  AlreadyReportedResponse,
  IMUsedResponse,

  /* 3×× Redirection */
  MultipleChoicesResponse,
  MovedPermanentlyResponse,
  FoundResponse,
  SeeOtherResponse,
  NotModifiedResponse,
  UseProxyResponse,
  TemporaryRedirectResponse,
  PermanentRedirectResponse,

  /* 4×× Client Error */
  BadRequestResponse,
  UnauthorizedResponse,
  PaymentRequiredResponse,
  ForbiddenResponse,
  NotFoundResponse,
  MethodNotAllowedResponse,
  NotAcceptableResponse,
  ProxyAuthenticationRequiredResponse,
  RequestTimeoutResponse,
  ConflictResponse,
  GoneResponse,
  LengthRequiredResponse,
  PreconditionFailedResponse,
  PayloadTooLargeResponse,
  RequestURITooLongResponse,
  UnsupportedMediaTypeResponse,
  RequestedRangeNotSatisfiableResponse,
  ExpecationFailedResponse,
  TeapotResponse,
  MisdirectedRequestResponse,
  UnprocessableEntityResponse,
  LockedResponse,
  FailedDependencyResponse,
  UpgradeRequiredResponse,
  PreconditionRequiredResponse,
  TooManyRequestsResponse,
  RequestHeaderFieldsTooLargeResponse,
  ConnectionClosedWithoutResponseResponse,
  UnavailableForLegalReasonsResponse,
  ClientClosedRequestResponse,

  /* 5×× Server Error */
  UnknownResponse,
  NotImplementedResponse,
  BadGatewayResponse,
  ServiceUnavailableResponse,
  GatewayTimeoutResponse,
  HTTPVersionNotSupportedResponse,
  VariantAlsoNegotiatesResponse,
  InsufficientStorageResponse,
  LoopDetectedResponse,
  NotExtendedResponse,
  NetworkAuthenticationRequiredResponse,
  NetworkConnectTimeoutErrorResponse,
} from '@shopify/hydrogen';

export async function api(request, {params: {handle}}) {
  const statusResponse = {
    /* 2×× Success */
    200: () => {
      throw new OKResponse();
    },
    201: () => {
      throw new CreatedResponse();
    },
    202: () => {
      throw new AcceptedResponse();
    },
    203: () => {
      throw new NonAuthorativeInformationResponse();
    },
    204: () => {
      throw new NoContentResponse();
    },
    205: () => {
      throw new ResetContentResponse();
    },
    206: () => {
      throw new PartialContentResponse();
    },
    207: () => {
      throw new MultiStatusResponse();
    },
    208: () => {
      throw new AlreadyReportedResponse();
    },
    226: () => {
      throw new IMUsedResponse();
    },

    /* 3×× Redirection */
    300: () => {
      throw new MultipleChoicesResponse();
    },
    301: () => {
      throw new MovedPermanentlyResponse();
    },
    302: () => {
      throw new FoundResponse();
    },
    303: () => {
      throw new SeeOtherResponse();
    },
    304: () => {
      throw new NotModifiedResponse();
    },
    305: () => {
      throw new UseProxyResponse();
    },
    307: () => {
      throw new TemporaryRedirectResponse();
    },
    308: () => {
      throw new PermanentRedirectResponse();
    },

    /* 4×× Client Error */
    400: () => {
      throw new BadRequestResponse();
    },
    401: () => {
      throw new UnauthorizedResponse();
    },
    402: () => {
      throw new PaymentRequiredResponse();
    },
    403: () => {
      throw new ForbiddenResponse();
    },
    404: () => {
      throw new NotFoundResponse();
    },
    405: () => {
      throw new MethodNotAllowedResponse();
    },
    406: () => {
      throw new NotAcceptableResponse();
    },
    407: () => {
      throw new ProxyAuthenticationRequiredResponse();
    },
    408: () => {
      throw new RequestTimeoutResponse();
    },
    409: () => {
      throw new ConflictResponse();
    },
    410: () => {
      throw new GoneResponse();
    },
    411: () => {
      throw new LengthRequiredResponse();
    },
    412: () => {
      throw new PreconditionFailedResponse();
    },
    413: () => {
      throw new PayloadTooLargeResponse();
    },
    414: () => {
      throw new RequestURITooLongResponse();
    },
    415: () => {
      throw new UnsupportedMediaTypeResponse();
    },
    416: () => {
      throw new RequestedRangeNotSatisfiableResponse();
    },
    417: () => {
      throw new ExpecationFailedResponse();
    },
    418: () => {
      throw new TeapotResponse();
    },
    421: () => {
      throw new MisdirectedRequestResponse();
    },
    422: () => {
      throw new UnprocessableEntityResponse();
    },
    423: () => {
      throw new LockedResponse();
    },
    424: () => {
      throw new FailedDependencyResponse();
    },
    426: () => {
      throw new UpgradeRequiredResponse();
    },
    428: () => {
      throw new PreconditionRequiredResponse();
    },
    429: () => {
      throw new TooManyRequestsResponse();
    },
    431: () => {
      throw new RequestHeaderFieldsTooLargeResponse();
    },
    444: () => {
      throw new ConnectionClosedWithoutResponseResponse();
    },
    451: () => {
      throw new UnavailableForLegalReasonsResponse();
    },
    /*'499': () => {
      throw new ClientClosedRequestResponse();
    },*/

    /* 5×× Server Error */
    500: () => {
      throw new UnknownResponse();
    },
    501: () => {
      throw new NotImplementedResponse();
    },
    502: () => {
      throw new BadGatewayResponse();
    },
    503: () => {
      throw new ServiceUnavailableResponse();
    },
    504: () => {
      throw new GatewayTimeoutResponse();
    },
    505: () => {
      throw new HTTPVersionNotSupportedResponse();
    },
    506: () => {
      throw new VariantAlsoNegotiatesResponse();
    },
    507: () => {
      throw new InsufficientStorageResponse();
    },
    508: () => {
      throw new LoopDetectedResponse();
    },
    510: () => {
      throw new NotExtendedResponse();
    },
    511: () => {
      throw new NetworkAuthenticationRequiredResponse();
    },
    /*'599': () => {
      throw new NetworkConnectTimeoutErrorResponse();
    },*/

    default: () => {
      return new Response('OK', {status: 200});
    },
  };

  return statusResponse[handle]();
}
