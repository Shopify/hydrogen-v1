import React, {ComponentType, JSXElementConstructor} from 'react';
import {
  renderToReadableStream,
  pipeToNodeWritable,
  // @ts-ignore
} from 'react-dom/unstable-fizz';
import {renderToString} from 'react-dom/server';
import {getErrorMarkup} from './utilities/error';
import ssrPrepass from 'react-ssr-prepass';
import {StaticRouter} from 'react-router-dom';
import type {ServerHandler} from './types';
import {HydrationContext} from './framework/Hydration/HydrationContext.server';
import type {ReactQueryHydrationContext} from './foundation/ShopifyProvider/types';
import {generateWireSyntaxFromRenderedHtml} from './framework/Hydration/wire.server';
import {FilledContext, HelmetProvider} from 'react-helmet-async';
import {Html} from './framework/Hydration/Html';
import {HydrationWriter} from './framework/Hydration/writer.server';
import {Renderer, Hydrator, Streamer} from './types';
import {ServerComponentResponse} from './framework/Hydration/ServerComponentResponse.server';
import {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import {dehydrate} from 'react-query/hydration';
import {getCacheControlHeader} from './framework/cache';
import type {ServerResponse} from 'http';
import {supportsReadableStream} from './framework/runtime';

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
      dev,
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
      dev,
    });

    const head = template.match(/<head>(.+?)<\/head>/s)![1];

    return isWorker
      ? streamWorkerResponse({ReactApp, componentResponse, head, state, dev})
      : streamNodeResponse({
          ReactApp,
          componentResponse,
          response,
          head,
          state,
          dev,
        });
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
      dev,
    });

    return isWorker
      ? streamWorkerResponse({
          ReactApp,
          componentResponse,
          state,
          dev,
          isReactHydrationRequest: true,
        })
      : streamNodeResponse({
          ReactApp,
          componentResponse,
          response,
          state,
          dev,
          isReactHydrationRequest: true,
        });
  };

  return {
    render,
    stream,
    hydrate,
  };
};

/**
 * Hydrogen's API allows developers to prevent streaming in order to return a custom response type.
 * However, since we're building a ReadableStream rather than a WritableStream, we cannot explicitly
 * say when to start piping (streaming) content. Instead, we check to see if we can stream once the
 * initial shell is ready. That allows us to buffer the response if needed. Then, we rely on a timer
 * callback function to actually return the Response by resolving it from the Promise.
 *
 * NOTE: We cannot simply `await` the Promise and call `resolve()` within one of the React callbacks
 * because some Worker runtimes like Cloudflare consider this a "noop" and will prematurely end the
 * request. Using `setTimeout` mitigates this, as it's considered a resolvable part of the request.
 */
function streamWorkerResponse({
  ReactApp,
  componentResponse,
  head,
  state,
  dev,
  isReactHydrationRequest,
}: {
  ReactApp: ComponentType;
  componentResponse: ServerComponentResponse;
  head?: string;
  state: any;
  dev?: boolean;
  isReactHydrationRequest?: boolean;
}) {
  return new Promise((resolve, reject) => {
    let canStream = false;
    let error: any;

    const app = isReactHydrationRequest ? (
      <HydrationContext.Provider value={true}>
        <ReactApp {...state} />
      </HydrationContext.Provider>
    ) : (
      <Html head={head!}>
        <ReactApp {...state} />
      </Html>
    );

    const stream = renderToReadableStream(app, {
      onReadyToStream() {
        canStream = !isReactHydrationRequest && componentResponse.canStream();
      },
      onCompleteAll() {
        canStream = true;
      },
      onError(e: any) {
        error = e;
        reject(e);
      },
    });

    async function maybeSendResponse() {
      if (!canStream) {
        setTimeout(maybeSendResponse, 20);
        return;
      }

      let status = error
        ? 500
        : componentResponse.customStatus?.code ??
          componentResponse.status ??
          200;

      /**
       * Don't allow custom statuses for Hydration responses.
       */
      if (isReactHydrationRequest) {
        status = error ? 500 : 200;
      }

      const statusText = !isReactHydrationRequest
        ? componentResponse.customStatus?.text
        : '';

      let responseInit = stream;

      /**
       * If responding to RSC, read the whole body and convert it to custom "wire" syntax.
       */
      if (isReactHydrationRequest) {
        responseInit = generateWireSyntaxFromRenderedHtml(
          await new Response(stream).text()
        );
      }

      const response = new Response(responseInit, {
        status,
        statusText,
        headers: {
          [getCacheControlHeader({dev})]: componentResponse.cacheControlHeader,
        },
      });

      if (!isReactHydrationRequest) {
        componentResponse.headers.forEach((value, key) =>
          response.headers.set(key, value)
        );
      }

      if (!response.headers.has('content-type')) {
        response.headers.set('content-type', 'text/html');
      }

      resolve(response);
    }

    maybeSendResponse();
  });
}

function streamNodeResponse({
  ReactApp,
  componentResponse,
  response,
  head,
  state,
  dev,
  isReactHydrationRequest,
}: {
  ReactApp: ComponentType;
  componentResponse: ServerComponentResponse;
  response: ServerResponse;
  head?: string;
  state: any;
  dev?: boolean;
  isReactHydrationRequest?: boolean;
}) {
  response.socket!.on('error', (error: any) => {
    console.error('Fatal', error);
  });

  let didError: Error | undefined;

  const writable = isReactHydrationRequest ? new HydrationWriter() : response;

  const app = isReactHydrationRequest ? (
    <HydrationContext.Provider value={true}>
      <ReactApp {...state} />
    </HydrationContext.Provider>
  ) : (
    <Html head={head!}>
      <ReactApp {...state} />
    </Html>
  );

  const {startWriting, abort} = pipeToNodeWritable(app, writable, {
    onReadyToStream() {
      if (isReactHydrationRequest) return;

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
        startWriting,
        dev ? didError : undefined
      );
    },
    onCompleteAll() {
      if (!isReactHydrationRequest) {
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
            startWriting,
            dev ? didError : undefined
          );
        }
      } else {
        // Tell React to start writing to the writer
        startWriting();

        // Tell React that the writer is ready to drain, which sometimes results in a last "chunk" being written.
        (writable as HydrationWriter).drain();

        response.statusCode = didError ? 500 : 200;
        response.setHeader(
          getCacheControlHeader({dev}),
          componentResponse.cacheControlHeader
        );
        response.end(
          generateWireSyntaxFromRenderedHtml(
            (writable as HydrationWriter).toString()
          )
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
  });

  setTimeout(abort, STREAM_ABORT_TIMEOUT_MS);
}

function buildReactApp({
  App,
  state,
  context,
  request,
  dev,
}: {
  App: ComponentType;
  state: any;
  context: any;
  request: ServerComponentRequest;
  dev: boolean | undefined;
}) {
  const helmetContext = {} as FilledContext;
  const componentResponse = new ServerComponentResponse();

  const ReactApp = (props: any) => (
    <StaticRouter
      location={{pathname: state.pathname, search: state.search}}
      context={context}
    >
      <HelmetProvider context={helmetContext}>
        <App {...props} request={request} response={componentResponse} />
      </HelmetProvider>
    </StaticRouter>
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

      const {startWriting} = pipeToNodeWritable(app, writer, {
        /**
         * When hydrating, we have to wait until `onCompleteAll` to avoid having
         * `template` and `script` tags inserted and rendered as part of the hydration response.
         */
        onCompleteAll() {
          // Tell React to start writing to the writer
          startWriting();

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
  const hydrationContext: ReactQueryHydrationContext = {};

  const app = isReactHydrationRequest ? (
    <HydrationContext.Provider value={true}>
      <ReactApp hydrationContext={hydrationContext} {...state} />
    </HydrationContext.Provider>
  ) : (
    <ReactApp hydrationContext={hydrationContext} {...state} />
  );

  await ssrPrepass(app);

  /**
   * Dehydrate all the queries made during the prepass above and store
   * them in the context object to be used for the next render pass.
   * This prevents rendering the Suspense fallback in `renderToString`.
   */
  if (hydrationContext.queryClient) {
    hydrationContext.dehydratedState = dehydrate(hydrationContext.queryClient);
  }

  const body = renderToString(app);

  return isReactHydrationRequest
    ? generateWireSyntaxFromRenderedHtml(body)
    : body;
}

export default renderHydrogen;

function startWritingHtmlToServerResponse(
  response: ServerResponse,
  startWriting: () => void,
  error?: Error
) {
  if (!response.headersSent) {
    response.setHeader('Content-type', 'text/html');
    response.write('<!DOCTYPE html>');
  }

  startWriting();

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
