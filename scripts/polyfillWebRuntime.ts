import fetch from 'node-fetch';
import AbortController from 'abort-controller';

// Note: globalThis.fetch is already polyfilled by Jest with DOM utilities

// @ts-ignore
globalThis.Headers = fetch.Headers;
// @ts-ignore
globalThis.Request = fetch.Request;
// @ts-ignore
globalThis.Response = fetch.Response;
// @ts-ignore
globalThis.AbortController = AbortController;
