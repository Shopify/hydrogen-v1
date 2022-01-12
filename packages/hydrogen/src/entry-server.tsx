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
import type {ServerResponse} from 'http';
import type {PassThrough as PassThroughType} from 'stream';

// @ts-ignore
import * as rscRenderer from '@shopify/hydrogen/vendor/react-server-dom-vite/writer';

const {
  renderToPipeableStream: rscRenderToPipeableStream,
  renderToReadableStream: rscRenderToReadableStream,
} = rscRenderer;

declare global {
  // This is provided by a Vite plugin
  // and will trigger tree-shaking.
  // eslint-disable-next-line no-var
  var __WORKER__: boolean;
}

const wrapInFlightContainer = ({
  init,
  chunk,
  nonce,
}: {
  init?: boolean;
  chunk?: string;
  nonce?: string;
}) =>
  `<script${nonce ? ` nonce="${nonce}"` : ''}>window.__flight${
    init ? '=[]' : `.push(\`${chunk}\`)`
  }</script>`;

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
    {context, request, template, dev}
  ) {
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

    /**
     * We allow the developer to "hook" into this process and mutate the params.
     */
    if (hook) {
      Object.assign(params, hook(params) || {});
    }

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
    {context, request, response, template, dev}
  ) {
    const log = getLoggerFromContext(request);
    const state = {pathname: url.pathname, search: url.search};

    // App for RSC rendering
    const {ReactApp: ReactAppRSC} = buildReactApp({
      App,
      state,
      context,
      request,
      dev,
      log,
      isRSC: true,
    });

    let flightResponseBuffer = '';
    const flush = (writable: {write: (chunk: string) => void}, chunk = '') => {
      if (flightResponseBuffer) {
        chunk = flightResponseBuffer + chunk;
        flightResponseBuffer = '';
      }

      if (chunk) {
        writable.write(wrapInFlightContainer({chunk}));
      }
    };

    if (__WORKER__) {
      // Worker branch
      // TODO implement RSC with TransformStream?
    } else {
      // Node.js branch

      const {pipe} = rscRenderToPipeableStream(<ReactAppRSC />);

      const writer = await createNodeWriter();
      writer.setEncoding('utf-8');
      writer.on('data', (chunk: string) => {
        if (response.headersSent) {
          flush(response, chunk);
        } else {
          flightResponseBuffer += chunk;
        }
      });

      pipe(writer);
    }

    // App for SSR rendering
    const {ReactApp, componentResponse} = buildReactApp({
      App,
      state,
      context,
      request,
      dev,
      log,
    });

    if (!__WORKER__ && response) {
      response.socket!.on('error', (error: any) => {
        log.fatal(error);
      });
    }

    let didError: Error | undefined;

    const ReactAppSSR = (
      <Html
        template={template}
        htmlAttrs={{lang: 'en'}}
        headSuffix={wrapInFlightContainer({init: true})}
      >
        <ReactApp />
      </Html>
    );

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
        onCompleteAll() {
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
            if (componentResponse.customBody instanceof Promise) {
              componentResponse.customBody.then((body) =>
                writable.write(encoder.encode(body))
              );
            } else {
              writable.write(encoder.encode(componentResponse.customBody));
            }

            deferred.resolve(false);
          } else {
            startWritingHtmlToStream(
              responseOptions,
              writable,
              encoder,
              dev ? didError : undefined
            );

            deferred.resolve(true);
          }
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

      writable.releaseLock();

      if (shouldUseStream) {
        readable.pipeThrough(transform);
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
            pipe,
            flush,
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
              flush,
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
      isRSC: true,
    });

    if (!__WORKER__ && response) {
      response.socket!.on('error', (error: any) => {
        log.fatal(error);
      });
    }

    if (__WORKER__) {
      const stream = rscRenderToReadableStream(
        <ReactApp />
      ) as ReadableStream<Uint8Array>;

      if (isStreamable) {
        logServerResponse('rsc', log, request, 200);
        return new Response(stream);
      }

      // Note: CFW does not support reader.piteTo nor iterable syntax
      const decoder = new TextDecoder();
      const reader = stream.getReader();
      let bufferedBody = '';

      while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        bufferedBody +=
          typeof value === 'string' ? value : decoder.decode(value);
      }

      logServerResponse('rsc', log, request, 200);

      return new Response(bufferedBody);
    } else {
      const stream = rscRenderToPipeableStream(<ReactApp />).pipe(response);

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

function buildReactApp({
  App,
  state,
  context,
  request,
  dev,
  log,
  isRSC = false,
}: {
  App: ComponentType;
  state?: object | null;
  context: any;
  request: ServerComponentRequest;
  dev: boolean | undefined;
  log: Logger;
  isRSC?: boolean;
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
    <ServerRequestProvider request={request} isRSC={isRSC}>
      <App {...state} {...props} {...hydrogenServerProps} />
    </ServerRequestProvider>
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
      log.warn(`The app failed to SSR after ${STREAM_ABORT_TIMEOUT_MS} ms`);
    }, STREAM_ABORT_TIMEOUT_MS);

    if (__WORKER__) {
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
  pipe: (r: ServerResponse) => void,
  flush: (w: ServerResponse) => void,
  error?: Error
) {
  if (!response.headersSent) {
    response.setHeader('Content-type', 'text/html');
    response.write('<!DOCTYPE html>');
  }

  pipe(response); // Writes <head> synchronously
  flush(response); // Uses the <head> written

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
