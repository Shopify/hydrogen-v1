import {Request, Response, Headers} from 'undici';
import AbortController from 'abort-controller';
import {TextEncoder, TextDecoder} from 'util';

// Note: globalThis.fetch is already polyfilled by Jest with DOM utilities

// @ts-ignore
globalThis.Headers = Headers;
// @ts-ignore
globalThis.Request = Request;
// @ts-ignore
globalThis.Response = Response;
// @ts-ignore
globalThis.AbortController = AbortController;

// @ts-ignore
globalThis.TextEncoder = TextEncoder;
// @ts-ignore
globalThis.TextDecoder = TextDecoder;
