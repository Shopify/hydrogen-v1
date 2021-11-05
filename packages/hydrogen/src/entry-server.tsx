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
      : {page: url.pathname};

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
    const state = {page: url.pathname};

    const {ReactApp, componentResponse} = buildReactApp({
      App,
      state,
      context,
      request,
      dev,
    });

    response.socket!.on('error', (error: any) => {
      console.error('Fatal', error);
    });

    let didError = false;

    const head = template.match(/<head>(.+?)<\/head>/s)![1];

    const {startWriting, abort} = pipeToNodeWritable(
      <Html head={head}>
        <ReactApp {...state} />
      </Html>,
      response,
      {
        onReadyToStream() {
          /**
           * TODO: This assumes `response.cache()` has been called _before_ any
           * queries which might be caught behind Suspense. Clarify this or add
           * additional checks downstream?
           */
          response.setHeader(
            getCacheControlHeader({dev}),
            componentResponse.cacheControlHeader
          );

          if (!componentResponse.canStream()) return;

          response.statusCode = didError ? 500 : 200;
          response.setHeader('Content-type', 'text/html');
          response.write('<!DOCTYPE html>');
          startWriting();
        },
        onCompleteAll() {
          if (componentResponse.canStream()) return;

          response.statusCode =
            componentResponse.status ?? (didError ? 500 : 200);

          componentResponse.headers.forEach((value, header) => {
            response.setHeader(header, value);
          });

          if (componentResponse.customBody) {
            if (componentResponse.customBody instanceof Promise) {
              componentResponse.customBody.then((body) => response.end(body));
            } else {
              response.end(componentResponse.customBody);
            }
          } else {
            response.setHeader('Content-type', 'text/html');
            response.write('<!DOCTYPE html>');
            startWriting();
          }
        },
        onError(error: any) {
          didError = true;

          if (dev) {
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
      dev,
    });

    response.socket!.on('error', (error: any) => {
      console.error('Fatal', error);
    });

    let didError = false;

    const writer = new HydrationWriter();

    const {startWriting, abort} = pipeToNodeWritable(
      <HydrationContext.Provider value={true}>
        <ReactApp {...state} />
      </HydrationContext.Provider>,
      writer,
      {
        /**
         * When hydrating, we have to wait until `onCompleteAll` to avoid having
         * `template` and `script` tags inserted and rendered as part of the hydration response.
         */
        onCompleteAll() {
          // Tell React to start writing to the writer
          startWriting();

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
          didError = true;
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
    <StaticRouter location={state.page} context={context}>
      <HelmetProvider context={helmetContext}>
        <App request={request} response={componentResponse} {...props} />
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
