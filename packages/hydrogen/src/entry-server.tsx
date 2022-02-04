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
  log as noContextLogger,
} from './utilities/log/log';
import {getErrorMarkup} from './utilities/error';
import {defer} from './utilities/defer';
import type {ImportGlobEagerOutput, ServerHandler} from './types';
import {Html} from './framework/Hydration/Html';
import {Renderer, Hydrator, Streamer} from './types';
import {ServerComponentResponse} from './framework/Hydration/ServerComponentResponse.server';
import type {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import {getCacheControlHeader} from './framework/cache';
import {ServerRequestProvider} from './foundation/ServerRequestProvider';
import {setShop} from './foundation/useShop';
import type {ServerResponse} from 'http';
import type {PassThrough as PassThroughType, Writable} from 'stream';
import {getApiRouteFromURL, getApiRoutesFromPages} from './utilities/apiRoutes';
import {ServerStateProvider} from './foundation/ServerStateProvider';

// @ts-ignore
import {renderToReadableStream as rscRenderToReadableStream} from '@shopify/hydrogen/vendor/react-server-dom-vite/writer.browser.server';
// @ts-ignore
import {createFromReadableStream} from '@shopify/hydrogen/vendor/react-server-dom-vite';
import type {RealHelmetData} from './foundation/Helmet/Helmet';

declare global {
  // This is provided by a Vite plugin
  // and will trigger tree-shaking.
  // eslint-disable-next-line no-var
  var __WORKER__: boolean;
}

/**
 * If a query is taking too long, or something else went wrong,
 * send back a response containing the Suspense fallback and rely
 * on the client to hydrate and build the React tree.
 */
const STREAM_ABORT_TIMEOUT_MS = 3000;

const HTML_CONTENT_TYPE = 'text/html; charset=UTF-8';

const renderHydrogen: ServerHandler = (App, {shopifyConfig, pages}) => {
  setShop(shopifyConfig);

  /**
   * The render function is responsible for turning the provided `App` into an HTML string,
   * and returning any initial state that needs to be hydrated into the client version of the app.
   * NOTE: This is currently only used for SEO bots or Worker runtime (where Stream is not yet supported).
   */
  const render: Renderer = async function (
    url,
    {request, template, nonce, dev}
  ) {
    const log = getLoggerFromContext(request);
    const state = {pathname: url.pathname, search: url.search};

    const {ReactApp, componentResponse} = buildReactApp({
      App,
      state,
      request,
      log,
      pages,
    });

    let html = await renderToBufferedString(
      <Html template={template}>
        <ServerStateProvider serverState={state} setServerState={() => {}}>
          <ReactApp />
        </ServerStateProvider>
      </Html>,
      {log, nonce}
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

    headers['Content-type'] = HTML_CONTENT_TYPE;
    const {bodyAttributes, htmlAttributes, ...head} = extractHeadElements(
      request.ctx.helmet
    );

    head.script = (head.script || '') + flightContainer({init: true, nonce});

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
    {request, response, template, nonce, dev}
  ) {
    const log = getLoggerFromContext(request);
    log.trace('start stream');
    const state = {pathname: url.pathname, search: url.search};
    let didError: Error | undefined;

    // App for RSC rendering
    const {ReactApp: ReactAppRSC, componentResponse} = buildReactApp({
      App,
      state,
      request,
      log,
      isRSC: true,
      pages,
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
        <ServerRequestProvider request={request} isRSC={false}>
          <ServerStateProvider serverState={state} setServerState={() => {}}>
            <RscConsumer />
          </ServerStateProvider>
        </ServerRequestProvider>
      </Html>
    );

    const rscToScriptTagReadable = new ReadableStream({
      start(controller) {
        log.trace('rsc start chunks');
        let init = true;
        const encoder = new TextEncoder();
        bufferReadableStream(rscReadableForFlight.getReader(), (chunk) => {
          const scriptTag = flightContainer({init, chunk, nonce});
          controller.enqueue(encoder.encode(scriptTag));
          init = false;
        }).then(() => {
          log.trace('rsc finish chunks');
          return controller.close();
        });
      },
    });

    if (__WORKER__) {
      const deferredShouldReturnApp = defer<boolean>();
      const encoder = new TextEncoder();
      const transform = new TransformStream();
      const writable = transform.writable.getWriter();
      const responseOptions = {} as ResponseOptions;

      const ssrReadable: ReadableStream = renderToReadableStream(ReactAppSSR, {
        nonce,
        onCompleteShell() {
          log.trace('worker ready to stream');

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
            return deferredShouldReturnApp.resolve(false);
          }

          if (!componentResponse.canStream()) return;

          startWritingHtmlToStream(
            responseOptions,
            writable,
            encoder,
            dev ? didError : undefined
          );

          deferredShouldReturnApp.resolve(true);
        },
        async onCompleteAll() {
          log.trace('worker complete stream');
          if (componentResponse.canStream()) return;

          Object.assign(
            responseOptions,
            getResponseOptions(componentResponse, didError)
          );

          if (isRedirect(responseOptions)) {
            // Redirects found after any async code
            return deferredShouldReturnApp.resolve(false);
          }

          if (componentResponse.customBody) {
            writable.write(encoder.encode(await componentResponse.customBody));
            return deferredShouldReturnApp.resolve(false);
          }

          startWritingHtmlToStream(
            responseOptions,
            writable,
            encoder,
            dev ? didError : undefined
          );

          deferredShouldReturnApp.resolve(true);
        },
        onError(error: any) {
          didError = error;

          if (dev && deferredShouldReturnApp.status === 'pending') {
            writable.write(getErrorMarkup(error));
          }

          console.error(error);
        },
      });

      if (await deferredShouldReturnApp.promise) {
        let bufferedSsr = '';
        let isPendingSsrWrite = false;
        const writingSSR = bufferReadableStream(
          ssrReadable.getReader(),
          (chunk) => {
            bufferedSsr += chunk;

            if (!isPendingSsrWrite) {
              isPendingSsrWrite = true;
              setTimeout(() => {
                isPendingSsrWrite = false;
                // React can write fractional chunks synchronously.
                // This timeout ensures we only write full HTML tags
                // in order to allow RSC writing concurrently.
                if (bufferedSsr) {
                  writable.write(encoder.encode(bufferedSsr));
                  bufferedSsr = '';
                }
              }, 0);
            }
          }
        );

        const writingRSC = bufferReadableStream(
          rscToScriptTagReadable.getReader(),
          (scriptTag) => writable.write(encoder.encode(scriptTag))
        );

        Promise.all([writingSSR, writingRSC]).then(() => {
          // Last SSR write might be pending, delay closing the writable one tick
          setTimeout(() => writable.close(), 0);
          logServerResponse('str', log, request, responseOptions.status);
        });
      } else {
        writable.close();
        logServerResponse('str', log, request, responseOptions.status);
      }

      if (await isStreamingSupported()) {
        return new Response(transform.readable, responseOptions);
      }

      const bufferedBody = await bufferReadableStream(
        transform.readable.getReader()
      );

      return new Response(bufferedBody, responseOptions);
    } else if (response) {
      response.socket!.on('error', log.fatal);

      const {pipe} = renderToPipeableStream(ReactAppSSR, {
        nonce,
        onCompleteShell() {
          log.trace('node ready to stream');
          /**
           * TODO: This assumes `response.cache()` has been called _before_ any
           * queries which might be caught behind Suspense. Clarify this or add
           * additional checks downstream?
           */
          response.setHeader(
            getCacheControlHeader({dev}),
            componentResponse.cacheControlHeader
          );

          writeHeadToServerResponse(response, componentResponse, log, didError);

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

          setTimeout(() => {
            log.trace('node pipe response');
            pipe(response);
          }, 0);

          bufferReadableStream(rscToScriptTagReadable.getReader(), (chunk) => {
            log.trace('rsc chunk');
            return response.write(chunk);
          });
        },
        async onCompleteAll() {
          log.trace('node complete stream');
          clearTimeout(streamTimeout);

          if (componentResponse.canStream() || response.writableEnded) return;

          writeHeadToServerResponse(response, componentResponse, log, didError);

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
      pages,
    });

    if (__WORKER__) {
      const readable = rscRenderToReadableStream(
        <ReactApp />
      ) as ReadableStream<Uint8Array>;

      if (isStreamable && (await isStreamingSupported())) {
        logServerResponse('rsc', log, request, 200);
        return new Response(readable);
      }

      // Note: CFW does not support reader.piteTo nor iterable syntax
      const bufferedBody = await bufferReadableStream(readable.getReader());

      logServerResponse('rsc', log, request, 200);

      return new Response(bufferedBody);
    } else if (response) {
      response.socket!.on('error', log.fatal);

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

  function getApiRoute(url: URL) {
    const routes = getApiRoutesFromPages(pages);
    return getApiRouteFromURL(url, routes);
  }

  return {
    render,
    stream,
    hydrate,
    getApiRoute,
    log: noContextLogger,
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
  pages,
}: {
  App: ComponentType;
  state?: object | null;
  request: ServerComponentRequest;
  log: Logger;
  isRSC?: boolean;
  pages?: ImportGlobEagerOutput;
}) {
  const componentResponse = new ServerComponentResponse();
  const hydrogenServerProps = {
    request,
    response: componentResponse,
    log,
  };

  const ReactApp = (props: any) => {
    const AppContent = (
      <ServerRequestProvider request={request} isRSC={isRSC}>
        <App {...state} {...props} {...hydrogenServerProps} pages={pages} />
      </ServerRequestProvider>
    );

    if (isRSC) return AppContent;

    // Note: The <Suspense> wrapper in SSR is
    // required to match hydration in browser
    return <React.Suspense fallback={null}>{AppContent}</React.Suspense>;
  };

  return {ReactApp, componentResponse};
}

function extractHeadElements({context: {helmet}}: RealHelmetData) {
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
  {log, nonce}: {log: Logger; nonce?: string}
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    const errorTimeout = setTimeout(() => {
      log.warn(`The app failed to SSR after ${STREAM_ABORT_TIMEOUT_MS} ms`);
    }, STREAM_ABORT_TIMEOUT_MS);

    if (__WORKER__) {
      const deferred = defer();
      const readable = renderToReadableStream(ReactApp, {
        nonce,
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
        nonce,
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
    response.setHeader('Content-type', HTML_CONTENT_TYPE);
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
  responseOptions.headers['Content-type'] = HTML_CONTENT_TYPE;
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
  log: Logger,
  error?: Error
) {
  if (response.headersSent) return;
  log.trace('writeHeadToServerResponse');

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

function flightContainer({
  init,
  chunk,
  nonce,
}: {
  chunk?: string;
  init?: boolean;
  nonce?: string;
}) {
  let script = `<script${nonce ? ` nonce="${nonce}"` : ''}>`;
  if (init) {
    script += 'var __flight=[];';
  }

  if (chunk) {
    const normalizedChunk = chunk?.replace(/\\/g, String.raw`\\`);
    script += `__flight.push(\`${normalizedChunk}\`)`;
  }

  return script + '</script>';
}

let cachedStreamingSupport: boolean;
async function isStreamingSupported() {
  if (cachedStreamingSupport === undefined) {
    try {
      const rs = new ReadableStream({
        start(controller) {
          controller.close();
        },
      });

      // This will throw in CFW until streaming
      // is supported. It works in Miniflare.
      await new Response(rs).text();

      cachedStreamingSupport = true;
    } catch (_) {
      cachedStreamingSupport = false;
    }
  }

  return cachedStreamingSupport;
}
