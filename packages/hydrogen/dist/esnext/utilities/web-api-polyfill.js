import fetch, { Request, Response, Headers } from 'node-fetch';
import AbortController from 'abort-controller';
import { ReadableStream, WritableStream, TransformStream, } from 'web-streams-polyfill/ponyfill';
import { FormData } from 'undici';
if (!globalThis.fetch) {
    Object.assign(globalThis, {
        fetch,
        Request,
        Response,
        Headers,
        AbortController,
    });
}
if (!globalThis.FormData) {
    Object.assign(globalThis, {
        FormData,
    });
}
if (!globalThis.ReadableStream) {
    Object.assign(globalThis, {
        ReadableStream,
        WritableStream,
        TransformStream,
    });
}
