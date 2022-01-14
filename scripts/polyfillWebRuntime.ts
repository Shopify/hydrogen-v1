import {Headers, Request, Response} from 'undici';
import AbortController from 'abort-controller';

// Note: globalThis.fetch is already polyfilled by Jest with DOM utilities

// @ts-ignore
globalThis.Headers = Headers;
// @ts-ignore
globalThis.Request = Request;
// @ts-ignore
globalThis.Response = Response;
// @ts-ignore
globalThis.AbortController = AbortController;
