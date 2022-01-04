import React, {ComponentType, JSXElementConstructor} from 'react';
import {
  // @ts-ignore
  renderToPipeableStream, // Only available in Node context
  // @ts-ignore
  renderToReadableStream, // Only available in Browser/Worker context
} from 'react-dom/server';
import {renderToString} from 'react-dom/server';
import {getErrorMarkup} from './utilities/error';
import ssrPrepass from 'react-ssr-prepass';
import {StaticRouter} from 'react-router-dom';
import type {ServerHandler} from './types';
import {HydrationContext} from './framework/Hydration/HydrationContext.server';
import {generateWireSyntaxFromRenderedHtml} from './framework/Hydration/wire.server';
import {FilledContext, HelmetProvider} from 'react-helmet-async';
import {Html} from './framework/Hydration/Html';
import {HydrationWriter} from './framework/Hydration/writer.server';
import {Renderer, Hydrator, Streamer} from './types';
import {ServerComponentResponse} from './framework/Hydration/ServerComponentResponse.server';
import {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import {getCacheControlHeader} from './framework/cache';
import {ServerResponse} from 'http';
import {RenderCacheProvider} from './foundation/RenderCacheProvider';

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
    const state = isReactHydrationRequest
      ? JSON.parse(url.searchParams?.get('state') ?? '{}')
      : {pathname: url.pathname, search: url.search};

    const {ReactApp, helmetContext, componentResponse} = buildReactApp({
      App,
      state,
      context,
      request,
    });

    const body = await renderApp(ReactApp, state, isReactHydrationRequest);

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
    const state = {pathname: url.pathname, search: url.search};

    const {ReactApp, componentResponse} = buildReactApp({
      App,
      state,
      context,
      request,
    });

    response.socket!.on('error', (error: any) => {
      console.error('Fatal', error);
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

          writeHeadToServerResponse(response, componentResponse, didError);
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
          if (componentResponse.canStream() || response.writableEnded) return;

          writeHeadToServerResponse(response, componentResponse, didError);
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

          console.error(error);
        },
      }
    );

    setTimeout(abort, STREAM_ABORT_TIMEOUT_MS);
  };

  /**
   * Stream a hydration response to the client.
   */
  const hydrate: Hydrator = function (
    url: URL,
    {context, request, response, dev}
  ) {
    const state = JSON.parse(url.searchParams.get('state') || '{}');

    const {ReactApp, componentResponse} = buildReactApp({
      App,
      state,
      context,
      request,
    });

    response.socket!.on('error', (error: any) => {
      console.error('Fatal', error);
    });

    let didError: Error | undefined;

    const writer = new HydrationWriter();

    const {pipe, abort} = renderToPipeableStream(
      <HydrationContext.Provider value={true}>
        <ReactApp {...state} />
      </HydrationContext.Provider>,
      {
        /**
         * When hydrating, we have to wait until `onCompleteAll` to avoid having
         * `template` and `script` tags inserted and rendered as part of the hydration response.
         */
        onCompleteAll() {
          // Tell React to start writing to the writer
          pipe(writer);

          // Tell React that the writer is ready to drain, which sometimes results in a last "chunk" being written.
          writer.drain();

          response.statusCode = didError ? 500 : 200;
          response.setHeader(
            getCacheControlHeader({dev}),
            componentResponse.cacheControlHeader
          );
          response.end(generateWireSyntaxFromRenderedHtml(writer.toString()));
        },
        onError(error: any) {
          didError = error;
          console.error(error);
        },
      }
    );

    setTimeout(abort, STREAM_ABORT_TIMEOUT_MS);
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
}: {
  App: ComponentType;
  state: any;
  context: any;
  request: ServerComponentRequest;
}) {
  const renderCache = {};
  const helmetContext = {} as FilledContext;
  const componentResponse = new ServerComponentResponse();
  const hydrogenServerProps = {
    request,
    response: componentResponse,
  };

  const ReactApp = (props: any) => (
    <RenderCacheProvider cache={renderCache}>
      <StaticRouter
        location={{pathname: state.pathname, search: state.search}}
        context={context}
      >
        <HelmetProvider context={helmetContext}>
          <App {...props} {...hydrogenServerProps} />
        </HelmetProvider>
      </StaticRouter>
    </RenderCacheProvider>
  );

  return {helmetContext, ReactApp, componentResponse};
}

function extractHeadElements(helmetContext: FilledContext) {
  const {helmet} = helmetContext;

  return {
    base: helmet.base.toString(),
    bodyAttributes: helmet.bodyAttributes.toString(),
    htmlAttributes: helmet.htmlAttributes.toString(),
    link: helmet.link.toString(),
    meta: helmet.meta.toString(),
    noscript: helmet.noscript.toString(),
    script: helmet.script.toString(),
    style: helmet.style.toString(),
    title: helmet.title.toString(),
  };
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
  isReactHydrationRequest?: boolean
) {
  /**
   * Temporary workaround until all Worker runtimes support ReadableStream
   */
  if (isWorker && !supportsReadableStream()) {
    return renderAppFromStringWithPrepass(
      ReactApp,
      state,
      isReactHydrationRequest
    );
  }

  const app = isReactHydrationRequest ? (
    <HydrationContext.Provider value={true}>
      <ReactApp {...state} />
    </HydrationContext.Provider>
  ) : (
    <ReactApp {...state} />
  );

  return renderAppFromBufferedStream(app, isReactHydrationRequest);
}

function renderAppFromBufferedStream(
  app: JSX.Element,
  isReactHydrationRequest?: boolean
) {
  return new Promise<string>((resolve, reject) => {
    if (isWorker) {
      let isComplete = false;

      const stream = renderToReadableStream(app, {
        onCompleteAll() {
          isComplete = true;
        },
        onError(error: any) {
          console.error(error);
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
        if (isReactHydrationRequest) {
          resolve(generateWireSyntaxFromRenderedHtml(await res.text()));
        } else {
          resolve(await res.text());
        }
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
          // Tell React to start writing to the writer
          pipe(writer);

          // Tell React that the writer is ready to drain, which sometimes results in a last "chunk" being written.
          writer.drain();

          if (isReactHydrationRequest) {
            resolve(generateWireSyntaxFromRenderedHtml(writer.toString()));
          } else {
            resolve(writer.toString());
          }
        },
        onError(error: any) {
          console.error(error);
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
  isReactHydrationRequest?: boolean
) {
  const app = isReactHydrationRequest ? (
    <HydrationContext.Provider value={true}>
      <ReactApp {...state} />
    </HydrationContext.Provider>
  ) : (
    <ReactApp {...state} />
  );

  await ssrPrepass(app);

  const body = renderToString(app);

  return isReactHydrationRequest
    ? generateWireSyntaxFromRenderedHtml(body)
    : body;
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
  response: ServerResponse,
  {headers, status, customStatus}: ServerComponentResponse,
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
}

function isRedirect(response: ServerResponse) {
  return response.statusCode >= 300 && response.statusCode < 400;
}
