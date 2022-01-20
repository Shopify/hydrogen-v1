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
import {Renderer, Hydrator, Streamer} from './types';
import {ServerComponentResponse} from './framework/Hydration/ServerComponentResponse.server';
import {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import {getCacheControlHeader} from './framework/cache';
import {ServerRequestProvider} from './foundation/ServerRequestProvider';
import {setShopifyConfig} from './foundation/useShop';
import type {ServerResponse} from 'http';
import type {PassThrough as PassThroughType, Writable} from 'stream';

// @ts-ignore
import {renderToReadableStream as rscRenderToReadableStream} from '@shopify/hydrogen/vendor/react-server-dom-vite/writer.browser.server';
// @ts-ignore
import {createFromReadableStream} from '@shopify/hydrogen/vendor/react-server-dom-vite';

declare global {
  // This is provided by a Vite plugin
  // and will trigger tree-shaking.
  // eslint-disable-next-line no-var
  var __WORKER__: boolean;
}

function flightContainer({
  init,
  chunk,
  nonce,
}: {
  init?: boolean;
  chunk?: string;
  nonce?: string;
}) {
  const normalizedChunk = chunk?.replace(/\\/g, String.raw`\\`);

  return `<script${nonce ? ` nonce="${nonce}"` : ''}>window.__flight${
    init ? '=[]' : `.push(\`${normalizedChunk}\`)`
  }</script>`;
}

/**
 * If a query is taking too long, or something else went wrong,
 * send back a response containing the Suspense fallback and rely
 * on the client to hydrate and build the React tree.
 */
const STREAM_ABORT_TIMEOUT_MS = 3000;

const renderHydrogen: ServerHandler = (App, {shopifyConfig}) => {
  setShopifyConfig(shopifyConfig);

  /**
   * The render function is responsible for turning the provided `App` into an HTML string,
   * and returning any initial state that needs to be hydrated into the client version of the app.
   * NOTE: This is currently only used for SEO bots or Worker runtime (where Stream is not yet supported).
   */
  const render: Renderer = async function (url, {request, template, dev}) {
    const log = getLoggerFromContext(request);
    const state = {pathname: url.pathname, search: url.search};

    const {ReactApp, helmetContext, componentResponse} = buildReactApp({
      App,
      state,
      request,
      log,
    });

    let html = await renderToBufferedString(
      <Html template={template}>
        <ReactApp />
      </Html>,
      {log}
    );

    const {headers, status, statusText} = getResponseOptions(componentResponse);

    /**
     * TODO: Also add `Vary` headers for `accept-language` and any other keys
     * we want to shard our full-page cache for all Hydrogen storefronts.
     */
    headers[getCacheControlHeader({dev})] =
      componentResponse.cacheControlHeader;

    if (componentResponse.customBody) {
      // This can be used to return sitemap.xml or any other custom response.

      logServerResponse('ssr', log, request, status);

      return new Response(await componentResponse.customBody, {
        status,
        statusText,
        headers,
      });
    }

    headers['Content-type'] = 'text/html';
    const params = {url, ...extractHeadElements(helmetContext)};

    const {bodyAttributes, htmlAttributes, ...head} = params;

    html = html
      .replace(
        /<head>(.*?)<\/head>/s,
        generateHeadTag(head as Record<string, any>)
      )
      .replace('<body', bodyAttributes ? `<body ${bodyAttributes}` : '$&')
      .replace('<html', htmlAttributes ? `<html ${htmlAttributes}` : '$&');

    logServerResponse('ssr', log, request, status);

    return new Response(html, {
      status,
      statusText,
      headers,
    });
  };

  /**
   * Stream a response to the client. NOTE: This omits custom `<head>`
   * information, so this method should not be used by crawlers.
   */
  const stream: Streamer = async function (
    url: URL,
    {request, response, template, dev}
  ) {
    const log = getLoggerFromContext(request);
    const state = {pathname: url.pathname, search: url.search};
    let didError: Error | undefined;

    if (!__WORKER__ && response) {
      response.socket!.on('error', (error: any) => {
        log.fatal(error);
      });
    }

    // App for RSC rendering
    const {ReactApp: ReactAppRSC, componentResponse} = buildReactApp({
      App,
      state,
      request,
      log,
      isRSC: true,
    });

    const [rscReadableForFizz, rscReadableForFlight] = (
      rscRenderToReadableStream(<ReactAppRSC />) as ReadableStream<Uint8Array>
    ).tee();

    const rscResponse = createFromReadableStream(rscReadableForFizz);
    function RscConsumer() {
      return (
        <React.Suspense fallback={null}>
          {rscResponse.readRoot()}
        </React.Suspense>
      );
    }

    const ReactAppSSR = (
      <Html template={template} htmlAttrs={{lang: 'en'}}>
        <RscConsumer />
      </Html>
    );

    const rscToScriptTagReadable = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(flightContainer({init: true})));

        bufferReadableStream(rscReadableForFlight.getReader(), (chunk) => {
          controller.enqueue(encoder.encode(flightContainer({chunk})));
        }).then(() => controller.close());
      },
    });

    if (__WORKER__) {
      const deferred = defer<boolean>();
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
            return deferred.resolve(false);
          }

          if (!componentResponse.canStream()) return;

          startWritingHtmlToStream(
            responseOptions,
            writable,
            encoder,
            dev ? didError : undefined
          );

          deferred.resolve(true);
        },
        async onCompleteAll() {
          if (componentResponse.canStream()) return;

          Object.assign(
            responseOptions,
            getResponseOptions(componentResponse, didError)
          );

          if (isRedirect(responseOptions)) {
            // Redirects found after any async code
            return deferred.resolve(false);
          }

          if (componentResponse.customBody) {
            writable.write(encoder.encode(await componentResponse.customBody));
            return deferred.resolve(false);
          }

          startWritingHtmlToStream(
            responseOptions,
            writable,
            encoder,
            dev ? didError : undefined
          );

          deferred.resolve(true);
        },
        onError(error: any) {
          didError = error;

          if (dev && deferred.status === 'pending') {
            writable.write(getErrorMarkup(error));
          }

          console.error(error);
        },
      });

      const shouldUseStream = await deferred.promise;

      if (shouldUseStream) {
        writable.releaseLock();
        readable.pipeTo(transform.writable);
      }

      logServerResponse('str', log, request, responseOptions.status);

      return new Response(transform.readable, responseOptions);
    } else {
      const {pipe} = renderToPipeableStream(ReactAppSSR, {
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
            dev ? didError : undefined
          );

          // Piping ends the response but RSC reader will always finish
          // earlier because SSR is also reading RSC until it finishes.
          pipe(response);
          bufferReadableStream(rscToScriptTagReadable.getReader(), (chunk) =>
            response.write(chunk)
          );
        },
        async onCompleteAll() {
          clearTimeout(streamTimeout);

          if (componentResponse.canStream() || response.writableEnded) return;

          writeHeadToServerResponse(response, componentResponse, didError);

          logServerResponse('str', log, request, response.statusCode);

          if (isRedirect(response)) {
            // Redirects found after any async code
            return response.end();
          }

          if (componentResponse.customBody) {
            return response.end(await componentResponse.customBody);
          }

          startWritingHtmlToServerResponse(
            response,
            dev ? didError : undefined
          );

          bufferReadableStream(rscToScriptTagReadable.getReader()).then(
            (scriptTags) => {
              // Piping ends the response so script tags
              // must be written before that.
              response.write(scriptTags);
              pipe(response);
            }
          );
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
        log.warn(
          `The app failed to stream after ${STREAM_ABORT_TIMEOUT_MS} ms`
        );
      }, STREAM_ABORT_TIMEOUT_MS);
    }
  };

  /**
   * Stream a hydration response to the client.
   */
  const hydrate: Hydrator = async function (
    url: URL,
    {request, response, isStreamable, dev}
  ) {
    const log = getLoggerFromContext(request);
    const state = JSON.parse(url.searchParams.get('state') || '{}');

    const {ReactApp} = buildReactApp({
      App,
      state,
      request,
      log,
      isRSC: true,
    });

    if (__WORKER__) {
      const readable = rscRenderToReadableStream(
        <ReactApp />
      ) as ReadableStream<Uint8Array>;

      if (isStreamable) {
        logServerResponse('rsc', log, request, 200);
        return new Response(readable);
      }

      // Note: CFW does not support reader.piteTo nor iterable syntax
      const bufferedBody = await bufferReadableStream(readable.getReader());

      logServerResponse('rsc', log, request, 200);

      return new Response(bufferedBody);
    } else {
      const rscWriter = await import(
        // @ts-ignore
        '@shopify/hydrogen/vendor/react-server-dom-vite/writer.node.server'
      );

      const stream = rscWriter
        .renderToPipeableStream(<ReactApp />)
        .pipe(response) as Writable;

      stream.on('finish', function () {
        logServerResponse('rsc', log, request, response!.statusCode);
      });
    }
  };

  return {
    render,
    stream,
    hydrate,
  };
};

async function bufferReadableStream(
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

function buildReactApp({
  App,
  state,
  request,
  log,
  isRSC = false,
}: {
  App: ComponentType;
  state?: object | null;
  request: ServerComponentRequest;
  log: Logger;
  isRSC?: boolean;
}) {
  const helmetContext = {} as FilledContext;
  const componentResponse = new ServerComponentResponse();
  const hydrogenServerProps = {
    request,
    response: componentResponse,
    helmetContext: helmetContext,
    log,
  };

  const ReactApp = (props: any) => {
    const AppContent = (
      <ServerRequestProvider request={request} isRSC={isRSC}>
        <App {...state} {...props} {...hydrogenServerProps} />
      </ServerRequestProvider>
    );

    if (isRSC) return AppContent;

    // Note: The <Suspense> wrapper in SSR is
    // required to match hydration in browser
    return <React.Suspense fallback={null}>{AppContent}</React.Suspense>;
  };

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
      log.warn(`The app failed to SSR after ${STREAM_ABORT_TIMEOUT_MS} ms`);
    }, STREAM_ABORT_TIMEOUT_MS);

    if (__WORKER__) {
      const deferred = defer();
      const readable = renderToReadableStream(ReactApp, {
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
      }) as ReadableStream<Uint8Array>;

      await deferred.promise.catch(reject);

      resolve(await bufferReadableStream(readable.getReader()));
    } else {
      const writer = await createNodeWriter();

      const {pipe} = renderToPipeableStream(ReactApp, {
        /**
         * When hydrating, we have to wait until `onCompleteAll` to avoid having
         * `template` and `script` tags inserted and rendered as part of the hydration response.
         */
        onCompleteAll() {
          clearTimeout(errorTimeout);

          let data = '';
          writer.on('data', (chunk) => (data += chunk.toString()));
          writer.once('error', reject);
          writer.once('end', () => resolve(data));
          // Tell React to start writing to the writer
          pipe(writer);
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
  error?: Error
) {
  if (!response.headersSent) {
    response.setHeader('Content-type', 'text/html');
    response.write('<!DOCTYPE html>');
  }

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

/**
 * Generate the contents of the `head` tag, and update the existing `<title>` tag
 * if one exists, and if a title is passed.
 */
function generateHeadTag({title, ...rest}: Record<string, string>) {
  const headProps = ['base', 'meta', 'style', 'noscript', 'script', 'link'];

  const otherHeadProps = headProps
    .map((prop) => rest[prop])
    .filter(Boolean)
    .join('\n');

  return (_outerHtml: string, innerHtml: string) => {
    let headHtml = otherHeadProps + innerHtml;

    if (title) {
      if (headHtml.includes('<title>')) {
        headHtml = headHtml.replace(/(<title>(?:.|\n)*?<\/title>)/, title);
      } else {
        headHtml += title;
      }
    }

    return `<head>${headHtml}</head>`;
  };
}

async function createNodeWriter() {
  // Importing 'stream' directly breaks Vite resolve
  // when building for workers, even though this code
  // does not run in a worker. Looks like tree-shaking
  // kicks in after the import analysis/bundle.
  const streamImport = __WORKER__ ? '' : 'stream';
  const {PassThrough} = await import(streamImport);
  return new PassThrough() as InstanceType<typeof PassThroughType>;
}
