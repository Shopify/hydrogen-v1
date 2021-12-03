import type {FlightResponse} from './rsc-client-config';
// @ts-ignore
import createFlightHydrator from 'react-client/flight';
import hydratorConfig from './rsc-client-config';

const {createResponse, reportGlobalError, processBinaryChunk, close} =
  createFlightHydrator(hydratorConfig);

function startReadingFromStream(
  response: FlightResponse,
  stream: ReadableStream
): void {
  const reader = stream.getReader();
  function progress({done, value}: any): void | Promise<void> {
    if (done) {
      close(response);
      return;
    }

    processBinaryChunk(response, value as Uint8Array);
    return reader.read().then(progress, error);
  }

  function error(e: Error) {
    reportGlobalError(response, e);
  }

  reader.read().then(progress, error);
}

export function createFromReadableStream(
  stream: ReadableStream
): FlightResponse {
  const response = createResponse() as FlightResponse;
  startReadingFromStream(response, stream);
  return response;
}

export function createFromFetch(promiseForResponse: Promise<Response>) {
  const response = createResponse() as FlightResponse;

  promiseForResponse.then(
    function (r) {
      startReadingFromStream(response, r.body!);
    },
    function (e) {
      reportGlobalError(response, e);
    }
  );

  return response;
}
