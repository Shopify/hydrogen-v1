import {
  // @ts-ignore
  renderToPipeableStream as _ssrRenderToPipeableStream, // Only available in Node context
  // @ts-ignore
  renderToReadableStream as _ssrRenderToReadableStream, // Only available in Browser/Worker context
} from 'react-dom/server';
// @ts-ignore
import {renderToReadableStream as _rscRenderToReadableStream} from '@shopify/hydrogen/vendor/react-server-dom-vite/writer.browser.server';
// @ts-ignore
import {createFromReadableStream as _createFromReadableStream} from '@shopify/hydrogen/vendor/react-server-dom-vite';
import type {Writable} from 'stream';

export const rscRenderToReadableStream = _rscRenderToReadableStream as (
  App: JSX.Element
) => ReadableStream<Uint8Array>;

export const createFromReadableStream = _createFromReadableStream as (
  rs: ReadableStream<Uint8Array>
) => {
  readRoot: () => JSX.Element;
};

type StreamOptions = {
  nonce?: string;
  bootstrapScripts?: string[];
  bootstrapModules?: string[];
  onError?: (error: Error) => void;
};

export const ssrRenderToPipeableStream = _ssrRenderToPipeableStream as (
  App: JSX.Element,
  options: StreamOptions & {
    onAllReady?: () => void;
    onShellReady?: () => void;
    onShellError?: (error: Error) => void;
  }
) => {pipe: Writable['pipe']};

export const ssrRenderToReadableStream = _ssrRenderToReadableStream as (
  App: JSX.Element,
  options: StreamOptions
) => Promise<ReadableStream<Uint8Array> & {allReady: Promise<void>}>;

export async function isStreamingSupported() {
  // TODO: Check if streaming is supported natively
  return Boolean(process?.env?.HYDROGEN_ENABLE_WORKER_STREAMING);
}

export async function bufferReadableStream(
  reader: ReadableStreamDefaultReader,
  cb?: (chunk: string) => void
) {
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const {done, value} = await reader.read();
    if (done) break;

    const stringValue =
      typeof value === 'string' ? value : decoder.decode(value);

    result += stringValue;

    if (cb) {
      cb(stringValue);
    }
  }

  return result;
}
