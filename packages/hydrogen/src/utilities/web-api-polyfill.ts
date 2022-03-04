import fetch, {Request, Response, Headers} from 'node-fetch';
import AbortController from 'abort-controller';
import {
  ReadableStream,
  WritableStream,
  TransformStream,
} from 'web-streams-polyfill/ponyfill';

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
