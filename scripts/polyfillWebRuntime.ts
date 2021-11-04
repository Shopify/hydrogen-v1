import {Headers, Request, Response} from 'node-fetch';

// Note: globalThis.fetch is already polyfilled by Jest with DOM utilities

// @ts-ignore
globalThis.Headers = Headers;
// @ts-ignore
globalThis.Request = Request;
// @ts-ignore
globalThis.Response = Response;
