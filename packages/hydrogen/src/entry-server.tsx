import React, {ComponentType, JSXElementConstructor} from 'react';
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
import {renderToString} from 'react-dom/server';
import {getErrorMarkup} from './utilities/error';
import ssrPrepass from 'react-ssr-prepass';
// import {StaticRouter} from 'react-router-dom';
import type {ServerHandler} from './types';
import {FilledContext} from 'react-helmet-async';
import {Html} from './framework/Hydration/Html';
import {HydrationWriter} from './framework/Hydration/writer.server';
import {Renderer, Hydrator, Streamer} from './types';
import {ServerComponentResponse} from './framework/Hydration/ServerComponentResponse.server';
import {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import {getCacheControlHeader} from './framework/cache';
import {ServerResponse} from 'http';

import {
  renderToPipeableStream as rscRenderToPipeableStream,
  renderToReadableStream as rscRenderToReadableStream,
  // @ts-ignore
} from '@shopify/hydrogen/vendor/react-server-dom-vite/writer';

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
  const render: Renderer = async function (
    url,
    {context, request, isReactHydrationRequest, dev}
  ) {
    const log = getLoggerFromContext(request);

    const state = isReactHydrationRequest
      ? JSON.parse(url.searchParams?.get('state') ?? '{}')
      : {pathname: url.pathname, search: url.search};

    const {ReactApp, helmetContext, componentResponse} = buildReactApp({
      App,
      state,
      context,
      request,
      dev,
      log,
    });

    const body = isReactHydrationRequest
      ? '' // TODO: Implement RSC without streaming -- Or wait until ReadableStream is supported
      : await renderApp(ReactApp, state, log);

    logServerResponse(
      'ssr',
      log,
      request,
      componentResponse.customStatus?.code ?? componentResponse.status ?? 200
    );

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

    return {body, componentResponse, ...params};
  };

  /**
   * Stream a response to the client. NOTE: This omits custom `<head>`
   * information, so this method should not be used by crawlers.
   */
  const stream: Streamer = function (
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

    response.socket!.on('error', (error: any) => {
      log.fatal(error);
    });

    let didError: Error | undefined;

    const head = template.match(/<head>(.+?)<\/head>/s)![1];

    const {pipe, abort} = renderToPipeableStream(
      <Html head={head}>
        <ReactApp {...state} />
      </Html>,
      {
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

          writeHeadToServerResponse(
            request,
            response,
            componentResponse,
            log,
            didError
          );
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

          writeHeadToServerResponse(
            request,
            response,
            componentResponse,
            log,
            didError
          );
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
      }
    );

    const streamTimeout = setTimeout(() => {
      const errorMessage = `The app failed to stream after ${STREAM_ABORT_TIMEOUT_MS} ms`;
      log.error(errorMessage);

      if (dev && response.headersSent) {
        response.write(getErrorMarkup(new Error(errorMessage)));
      }

      abort();
    }, STREAM_ABORT_TIMEOUT_MS);
  };

  /**
   * Stream a hydration response to the client.
   */
  const hydrate: Hydrator = function (
    url: URL,
    {context, request, response, dev}
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

    response.socket!.on('error', (error: any) => {
      log.fatal(error);
    });

    if (rscRenderToPipeableStream) {
      rscRenderToPipeableStream(<ReactApp {...state} />).pipe(response);
    } else if (rscRenderToReadableStream) {
      const stream = rscRenderToReadableStream(<ReactApp {...state} />);
      // TODO: How do we pipe the stream to the response?
      return new Response(stream);
    }

    logServerResponse('rsc', log, request, response.statusCode);
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
  state: any;
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
    <App {...props} {...hydrogenServerProps} />
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

function supportsReadableStream() {
  try {
    new ReadableStream();
    return true;
  } catch (_e) {
    return false;
  }
}

async function renderApp(
  ReactApp: JSXElementConstructor<any>,
  state: any,
  log: Logger
): Promise<string> {
  /**
   * Temporary workaround until all Worker runtimes support ReadableStream
   */
  if (isWorker && !supportsReadableStream()) {
    return renderAppFromStringWithPrepass(ReactApp, state, log);
  }

  return renderAppFromBufferedStream(ReactApp, log, state);
}

function renderAppFromBufferedStream(
  ReactApp: JSXElementConstructor<any>,
  log: Logger,
  state: any
) {
  const app = <ReactApp {...state} />;

  return new Promise<string>((resolve, reject) => {
    const errorTimeout = setTimeout(() => {
      reject(
        new Error(`The app failed to SSR after ${STREAM_ABORT_TIMEOUT_MS} ms`)
      );
    }, STREAM_ABORT_TIMEOUT_MS);

    if (isWorker) {
      let isComplete = false;

      const stream = renderToReadableStream(app, {
        onCompleteAll() {
          clearTimeout(errorTimeout);
          isComplete = true;
        },
        onError(error: any) {
          log.error(error);
          reject(error);
        },
      }) as ReadableStream;

      /**
       * We want to wait until `onCompleteAll` has been called before fetching the
       * stream body. Otherwise, React 18's streaming JS script/template tags
       * will be included in the output and cause issues when loading
       * the Client Components in the browser.
       */
      async function checkForResults() {
        if (!isComplete) {
          setTimeout(checkForResults, 100);
          return;
        }

        /**
         * Use the stream to build a `Response`, and fetch the body from the response
         * to resolve and be processed by the rest of the pipeline.
         */
        const res = new Response(stream);
        resolve(await res.text());
      }

      checkForResults();
    } else {
      const writer = new HydrationWriter();

      const {pipe} = renderToPipeableStream(app, {
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

/**
 * If we can't render a "blocking" response by buffering React's SSR
 * streaming functionality (likely due to lack of support for a primitive
 * in the runtime), we fall back to using `renderToString`. By default,
 * `renderToString` stops at Suspense boundaries and will not
 * keep trying them until they resolve. This means have to
 * use ssr-prepass to fetch all the queries once, store
 * the results in a context object, and re-render.
 */
async function renderAppFromStringWithPrepass(
  ReactApp: JSXElementConstructor<any>,
  state: any,
  log: Logger
) {
  const app = <ReactApp {...state} />;

  await ssrPrepass(app);

  return renderToString(app);
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

function writeHeadToServerResponse(
  request: ServerComponentRequest,
  response: ServerResponse,
  {headers, status, customStatus}: ServerComponentResponse,
  log: Logger,
  error?: Error
) {
  if (response.headersSent) return;

  headers.forEach((value, key) => response.setHeader(key, value));

  if (error) {
    response.statusCode = 500;
  } else {
    response.statusCode = customStatus?.code ?? status ?? 200;

    if (customStatus?.text) {
      response.statusMessage = customStatus.text;
    }
  }

  logServerResponse('str', log, request, response.statusCode);
}

function isRedirect(response: ServerResponse) {
  return response.statusCode >= 300 && response.statusCode < 400;
}
