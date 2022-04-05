import {fetch, Request, Response, Headers} from 'undici';
import AbortController from 'abort-controller';
import {ReadableStream, WritableStream, TransformStream} from 'node:stream/web';

if (!globalThis.fetch) {
  Object.assign(globalThis, {
    fetch,
    Request,
    Response,
    Headers,
    AbortController,
  });
}

if (!globalThis.ReadableStream) {
  Object.assign(globalThis, {
    ReadableStream,
    WritableStream,
    TransformStream,
  });
}
