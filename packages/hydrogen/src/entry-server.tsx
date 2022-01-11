import React, {ComponentType} from 'react';
import {
  // @ts-ignore
  renderToPipeableStream, // Only available in Node context
  // @ts-ignore
  renderToReadableStream, // Only available in Browser/Worker context
} from 'react-dom/server';
import {
  Logger,
  logServerResponse,
  getLoggerFromContext,
} from './utilities/log/log';
import {getErrorMarkup} from './utilities/error';
import {defer} from './utilities/defer';
import type {ServerHandler} from './types';
import {FilledContext} from 'react-helmet-async';
import {Html} from './framework/Hydration/Html';
import {HydrationWriter} from './framework/Hydration/writer.server';
import {Renderer, Hydrator, Streamer} from './types';
import {ServerComponentResponse} from './framework/Hydration/ServerComponentResponse.server';
import {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import {getCacheControlHeader} from './framework/cache';
import {ServerResponse} from 'http';

// @ts-ignore
import * as rscRenderer from '@shopify/hydrogen/vendor/react-server-dom-vite/writer';

const {
  renderToPipeableStream: rscRenderToPipeableStream,
  renderToReadableStream: rscRenderToReadableStream,
} = rscRenderer;

/**
 * react-dom/unstable-fizz provides different entrypoints based on runtime:
 * - `renderToReadableStream` for "browser" (aka worker)
 * - `pipeToNodeWritable` for node.js
 */
const isWorker = Boolean(renderToReadableStream);

/**
 * If a query is taking too long, or something else went wrong,
 * send back a response containing the Suspense fallback and rely
 * on the client to hydrate and build the React tree.
 */
const STREAM_ABORT_TIMEOUT_MS = 3000;

const renderHydrogen: ServerHandler = (App, hook) => {
  /**
   * The render function is responsible for turning the provided `App` into an HTML string,
   * and returning any initial state that needs to be hydrated into the client version of the app.
   * NOTE: This is currently only used for SEO bots or Worker runtime (where Stream is not yet supported).
   */
  const render: Renderer = async function (url, {context, request, dev}) {
    const log = getLoggerFromContext(request);

    const state = {pathname: url.pathname, search: url.search};

    const {ReactApp, helmetContext, componentResponse} = buildReactApp({
      App,
      state,
      context,
      request,
      dev,
      log,
    });

    const body = await renderToBufferedString(<ReactApp />, {log});

    if (componentResponse.customBody) {
      return {body: await componentResponse.customBody, url, componentResponse};
    }

    let params = {url, ...extractHeadElements(helmetContext)};

    /**
     * We allow the developer to "hook" into this process and mutate the params.
     */
    if (hook) {
      params = hook(params) || params;
    }

    logServerResponse(
      'ssr',
      log,
      request,
      componentResponse.customStatus?.code ?? componentResponse.status ?? 200
    );

    return {body, componentResponse, ...params};
  };

  /**
   * Stream a response to the client. NOTE: This omits custom `<head>`
   * information, so this method should not be used by crawlers.
   */
  const stream: Streamer = async function (
    url: URL,
    {context, request, response, template, dev}
  ) {
    const log = getLoggerFromContext(request);
    const state = {pathname: url.pathname, search: url.search};

    const {ReactApp, componentResponse} = buildReactApp({
      App,
      state,
      context,
      request,
      dev,
      log,
    });

    if (response) {
      response.socket!.on('error', (error: any) => {
        log.fatal(error);
      });
    }

    let didError: Error | undefined;

    const head = template.match(/<head>(.+?)<\/head>/s)![1];

    const ReactAppSSR = (
      <Html head={head}>
        <ReactApp />
      </Html>
    );

    if (renderToPipeableStream) {
      const {pipe, abort} = renderToPipeableStream(ReactAppSSR, {
        onCompleteShell() {
          /**
           * TODO: This assumes `response.cache()` has been called _before_ any
           * queries which might be caught behind Suspense. Clarify this or add
           * additional checks downstream?
           */
          response.setHeader(
            getCacheControlHeader({dev}),
            componentResponse.cacheControlHeader
          );

          writeHeadToServerResponse(response, componentResponse, didError);

          logServerResponse('str', log, request, response.statusCode);

          if (isRedirect(response)) {
            // Return redirects early without further rendering/streaming
            return response.end();
          }

          if (!componentResponse.canStream()) return;

          startWritingHtmlToServerResponse(
            response,
            pipe,
            dev ? didError : undefined
          );
        },
        onCompleteAll() {
          clearTimeout(streamTimeout);

          if (componentResponse.canStream() || response.writableEnded) return;

          writeHeadToServerResponse(response, componentResponse, didError);

          logServerResponse('str', log, request, response.statusCode);

          if (isRedirect(response)) {
            // Redirects found after any async code
            return response.end();
          }

          if (componentResponse.customBody) {
            if (componentResponse.customBody instanceof Promise) {
              componentResponse.customBody.then((body) => response.end(body));
            } else {
              response.end(componentResponse.customBody);
            }
          } else {
            startWritingHtmlToServerResponse(
              response,
              pipe,
              dev ? didError : undefined
            );
          }
        },
        onError(error: any) {
          didError = error;

          if (dev && response.headersSent) {
            // Calling write would flush headers automatically.
            // Delay this error until headers are properly sent.
            response.write(getErrorMarkup(error));
          }

          log.error(error);
        },
      });

      const streamTimeout = setTimeout(() => {
        const errorMessage = `The app failed to stream after ${STREAM_ABORT_TIMEOUT_MS} ms`;
        log.error(errorMessage);

        if (dev && response.headersSent) {
          response.write(getErrorMarkup(new Error(errorMessage)));
        }

        abort();
      }, STREAM_ABORT_TIMEOUT_MS);
    } else if (renderToReadableStream) {
      const deferred = defer();
      const encoder = new TextEncoder();
      const transform = new TransformStream();
      const writable = transform.writable.getWriter();
      const responseOptions = {} as ResponseOptions;

      const readable: ReadableStream = renderToReadableStream(ReactAppSSR, {
        onCompleteShell() {
          Object.assign(
            responseOptions,
            getResponseOptions(componentResponse, didError)
          );

          /**
           * TODO: This assumes `response.cache()` has been called _before_ any
           * queries which might be caught behind Suspense. Clarify this or add
           * additional checks downstream?
           */
          responseOptions.headers[getCacheControlHeader({dev})] =
            componentResponse.cacheControlHeader;

          if (isRedirect(responseOptions)) {
            // Return redirects early without further rendering/streaming
            return deferred.resolve(null);
          }

          if (!componentResponse.canStream()) return;

          startWritingHtmlToStream(
            responseOptions,
            writable,
            encoder,
            dev ? didError : undefined
          );

          deferred.resolve(null);
          readable.pipeThrough(transform);
        },
        onCompleteAll() {
          if (componentResponse.canStream()) return;

          Object.assign(
            responseOptions,
            getResponseOptions(componentResponse, didError)
          );

          if (isRedirect(responseOptions)) {
            // Redirects found after any async code
            return deferred.resolve(null);
          }

          if (componentResponse.customBody) {
            if (componentResponse.customBody instanceof Promise) {
              componentResponse.customBody.then((body) =>
                writable.write(encoder.encode(body))
              );
            } else {
              writable.write(encoder.encode(componentResponse.customBody));
            }
          } else {
            startWritingHtmlToStream(
              responseOptions,
              writable,
              encoder,
              dev ? didError : undefined
            );

            readable.pipeThrough(transform);
          }

          deferred.resolve(null);
        },
        onError(error: any) {
          didError = error;

          if (dev && deferred.status === 'pending') {
            writable.write(getErrorMarkup(error));
          }

          console.error(error);
        },
      });

      await deferred.promise;

      logServerResponse('str', log, request, responseOptions.status);

      return new Response(transform.readable, responseOptions);
    }
  };

  /**
   * Stream a hydration response to the client.
   */
  const hydrate: Hydrator = async function (
    url: URL,
    {context, request, response, isStreamable, dev}
  ) {
    const log = getLoggerFromContext(request);
    const state = JSON.parse(url.searchParams.get('state') || '{}');

    const {ReactApp} = buildReactApp({
      App,
      state,
      context,
      request,
      dev,
      log,
    });

    if (response) {
      response.socket!.on('error', (error: any) => {
        log.fatal(error);
      });
    }

    if (rscRenderToPipeableStream) {
      const stream = rscRenderToPipeableStream(<ReactApp />).pipe(response);

      stream.on('finish', function () {
        logServerResponse('rsc', log, request, response!.statusCode);
      });
    } else if (rscRenderToReadableStream) {
      const stream = rscRenderToReadableStream(
        <ReactApp />
      ) as ReadableStream<Uint8Array>;

      if (isStreamable) {
        // TODO: there's no 'on' method in ReadableStream. How do we know when
        // it finishes? RS.piteTo(writable).then(...) ? stream.tee => read.then(...) ?
        // stream.on('end', function () {
        //   logServerResponse('rsc', log, request, response.statusCode);
        // });

        return new Response(stream);
      }

      // Note: CFW does not support reader.piteTo nor iterable syntax
      const decoder = new TextDecoder();
      const reader = stream.getReader();

      let done = false;
      let bufferedBody = '';

      while (!done) {
        const progress = await reader.read();

        bufferedBody += decoder.decode(progress.value);
        done = progress.done;
      }

      logServerResponse('rsc', log, request, 200);

      return new Response(bufferedBody);
    }
  };

  return {
    render,
    stream,
    hydrate,
  };
};

function buildReactApp({
  App,
  state,
  context,
  request,
  dev,
  log,
}: {
  App: ComponentType;
  state?: object | null;
  context: any;
  request: ServerComponentRequest;
  dev: boolean | undefined;
  log: Logger;
}) {
  const renderCache = {};
  const helmetContext = {} as FilledContext;
  const componentResponse = new ServerComponentResponse();
  const hydrogenServerProps = {
    request,
    response: componentResponse,
    helmetContext: helmetContext,
    cache: renderCache,
    log,
  };

  const ReactApp = (props: any) => (
    // <RenderCacheProvider cache={renderCache}>
    <App {...state} {...props} {...hydrogenServerProps} />
    // </RenderCacheProvider>
  );

  return {helmetContext, ReactApp, componentResponse};
}

function extractHeadElements(helmetContext: FilledContext) {
  const {helmet} = helmetContext;

  return helmet
    ? {
        base: helmet.base.toString(),
        bodyAttributes: helmet.bodyAttributes.toString(),
        htmlAttributes: helmet.htmlAttributes.toString(),
        link: helmet.link.toString(),
        meta: helmet.meta.toString(),
        noscript: helmet.noscript.toString(),
        script: helmet.script.toString(),
        style: helmet.style.toString(),
        title: helmet.title.toString(),
      }
    : {};
}

async function renderToBufferedString(
  ReactApp: JSX.Element,
  {log}: {log: Logger}
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    const errorTimeout = setTimeout(() => {
      reject(
        new Error(`The app failed to SSR after ${STREAM_ABORT_TIMEOUT_MS} ms`)
      );
    }, STREAM_ABORT_TIMEOUT_MS);

    if (isWorker) {
      const deferred = defer();
      const stream = renderToReadableStream(ReactApp, {
        onCompleteAll() {
          clearTimeout(errorTimeout);
          /**
           * We want to wait until `onCompleteAll` has been called before fetching the
           * stream body. Otherwise, React 18's streaming JS script/template tags
           * will be included in the output and cause issues when loading
           * the Client Components in the browser.
           */
          deferred.resolve(null);
        },
        onError(error: any) {
          log.error(error);
          deferred.reject(error);
        },
      }) as ReadableStream;

      await deferred.promise.catch(reject);

      /**
       * Use the stream to build a `Response`, and fetch the body from the response
       * to resolve and be processed by the rest of the pipeline.
       */
      resolve(await new Response(stream).text());
    } else {
      const writer = new HydrationWriter();

      const {pipe} = renderToPipeableStream(ReactApp, {
        /**
         * When hydrating, we have to wait until `onCompleteAll` to avoid having
         * `template` and `script` tags inserted and rendered as part of the hydration response.
         */
        onCompleteAll() {
          clearTimeout(errorTimeout);
          // Tell React to start writing to the writer
          pipe(writer);

          // Tell React that the writer is ready to drain, which sometimes results in a last "chunk" being written.
          writer.drain();

          resolve(writer.toString());
        },
        onError(error: any) {
          log.error(error);
          reject(error);
        },
      });
    }
  });
}

export default renderHydrogen;

function startWritingHtmlToServerResponse(
  response: ServerResponse,
  pipe: (r: ServerResponse) => void,
  error?: Error
) {
  if (!response.headersSent) {
    response.setHeader('Content-type', 'text/html');
    response.write('<!DOCTYPE html>');
  }

  pipe(response);

  if (error) {
    // This error was delayed until the headers were properly sent.
    response.write(getErrorMarkup(error));
  }
}

function startWritingHtmlToStream(
  responseOptions: ResponseOptions,
  writable: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  error?: Error
) {
  responseOptions.headers['Content-type'] = 'text/html';
  writable.write(encoder.encode('<!DOCTYPE html>'));

  if (error) {
    // This error was delayed until the headers were properly sent.
    writable.write(encoder.encode(getErrorMarkup(error)));
  }
}

type ResponseOptions = {
  headers: Record<string, string>;
  status: number;
  statusText?: string;
};

function getResponseOptions(
  {headers, status, customStatus}: ServerComponentResponse,
  error?: Error
) {
  const responseInit = {} as ResponseOptions;
  // @ts-ignore
  responseInit.headers = Object.fromEntries(headers.entries());

  if (error) {
    responseInit.status = 500;
  } else {
    responseInit.status = customStatus?.code ?? status ?? 200;

    if (customStatus?.text) {
      responseInit.statusText = customStatus.text;
    }
  }

  return responseInit;
}

function writeHeadToServerResponse(
  response: ServerResponse,
  serverComponentResponse: ServerComponentResponse,
  error?: Error
) {
  if (response.headersSent) return;

  const {headers, status, statusText} = getResponseOptions(
    serverComponentResponse,
    error
  );
  response.statusCode = status;

  if (statusText) {
    response.statusMessage = statusText;
  }

  Object.entries(headers).forEach(([key, value]) =>
    response.setHeader(key, value)
  );
}

function isRedirect(response: {status?: number; statusCode?: number}) {
  const status = response.status ?? response.statusCode ?? 0;
  return status >= 300 && status < 400;
}
