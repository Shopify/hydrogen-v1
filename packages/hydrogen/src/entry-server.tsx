import React, {Suspense} from 'react';
import {
  Logger,
  logServerResponse,
  logCacheControlHeaders,
  logQueryTimings,
  getLoggerWithContext,
} from './utilities/log';
import {getErrorMarkup} from './utilities/error';
import type {
  AssembleHtmlParams,
  RunSsrParams,
  RunRscParams,
  ResolvedHydrogenConfig,
  ResolvedHydrogenRoutes,
  RequestHandler,
} from './types';
import type {RequestHandlerOptions} from './shared-types';
import {Html, applyHtmlHead} from './foundation/Html/Html';
import {HydrogenResponse} from './foundation/HydrogenResponse/HydrogenResponse.server';
import {HydrogenRequest} from './foundation/HydrogenRequest/HydrogenRequest.server';
import {
  preloadRequestCacheData,
  ServerRequestProvider,
} from './foundation/ServerRequestProvider';
import type {ServerResponse} from 'http';
import type {PassThrough as PassThroughType} from 'stream';
import {
  getApiRouteFromURL,
  renderApiRoute,
  getApiRoutes,
} from './utilities/apiRoutes';
import {ServerPropsProvider} from './foundation/ServerPropsProvider';
import {isBotUA} from './utilities/bot-ua';
import {getCache, setCache} from './foundation/runtime';
import {
  ssrRenderToPipeableStream,
  ssrRenderToReadableStream,
  rscRenderToReadableStream,
  createFromReadableStream,
  bufferReadableStream,
} from './streaming.server';
import {RSC_PATHNAME} from './constants';
import {stripScriptsFromTemplate} from './utilities/template';
import {setLogger, RenderType} from './utilities/log/log';
import {Analytics} from './foundation/Analytics/Analytics.server';
import {DevTools} from './foundation/DevTools/DevTools.server';
import {getSyncSessionApi} from './foundation/session/session';
import {parseJSON} from './utilities/parse';
import {htmlEncode} from './utilities';
import {splitCookiesString} from 'set-cookie-parser';
import {
  deleteItemFromCache,
  getItemFromCache,
  isStale,
  setItemInCache,
} from './foundation/Cache/cache';
import {CacheShort, NO_STORE} from './foundation/Cache/strategies';
import {getBuiltInRoute} from './foundation/BuiltInRoutes/BuiltInRoutes';

declare global {
  // This is provided by a Vite plugin
  // and will trigger tree-shaking.
  // eslint-disable-next-line no-var
  var __HYDROGEN_WORKER__: boolean;
}

const DOCTYPE = '<!DOCTYPE html>';
const CONTENT_TYPE = 'Content-Type';
const HTML_CONTENT_TYPE = 'text/html; charset=UTF-8';

export const renderHydrogen = (App: any) => {
  const handleRequest: RequestHandler = async function (rawRequest, options) {
    const {cache, context, buyerIpHeader} = options;

    const request = new HydrogenRequest(rawRequest);
    const url = new URL(request.url);

    const {default: inlineHydrogenConfig} = await import(
      // @ts-ignore
      // eslint-disable-next-line node/no-missing-import
      'virtual__hydrogen.config.ts'
    );

    const {default: hydrogenRoutes} = await import(
      // @ts-ignore
      // eslint-disable-next-line node/no-missing-import
      'virtual__hydrogen-routes.server.jsx'
    );

    const hydrogenConfig: ResolvedHydrogenConfig = {
      ...inlineHydrogenConfig,
      routes: hydrogenRoutes,
    };

    request.ctx.hydrogenConfig = hydrogenConfig;
    request.ctx.buyerIpHeader = buyerIpHeader;

    setLogger(hydrogenConfig.logger);
    const log = getLoggerWithContext(request);

    const response = new HydrogenResponse();

    if (hydrogenConfig.poweredByHeader ?? true) {
      // If not defined in the config, always show the header
      response.headers.set('powered-by', 'Shopify-Hydrogen');
    }

    const sessionApi = hydrogenConfig.session
      ? hydrogenConfig.session(log)
      : undefined;

    request.ctx.session = getSyncSessionApi(request, response, log, sessionApi);

    /**
     * Inject the cache & context into the module loader so we can pull it out for subrequests.
     */
    request.ctx.runtime = context;

    setCache(cache);

    const builtInRouteResource = getBuiltInRoute(url);

    if (builtInRouteResource) {
      const apiResponse = await renderApiRoute(
        request,
        {
          resource: builtInRouteResource,
          params: {},
          hasServerComponent: false,
        },
        hydrogenConfig,
        {
          session: sessionApi,
          suppressLog: true,
        }
      );

      return apiResponse instanceof Request
        ? handleRequest(apiResponse, options)
        : apiResponse;
    }

    // Check if we have cached response
    if (cache) {
      const cachedResponse = await getItemFromCache(request.cacheKey());
      if (cachedResponse) {
        if (isStale(request, cachedResponse)) {
          const lockCacheKey = request.cacheKey(true);
          const staleWhileRevalidatePromise = getItemFromCache(
            lockCacheKey
          ).then(async (lockExists: Response | undefined) => {
            if (lockExists) return;
            try {
              // Don't stream when creating a response for cache
              response.doNotStream();

              await setItemInCache(
                lockCacheKey,
                new Response(null),
                CacheShort({
                  maxAge: 10,
                })
              );

              await processRequest(
                handleRequest,
                App,
                url,
                request,
                sessionApi,
                options,
                response,
                hydrogenConfig,
                true
              );
            } catch (e: any) {
              log.error('Cache revalidate error', e);
            }
          });

          // Asynchronously wait for it in workers
          request.ctx.runtime?.waitUntil(staleWhileRevalidatePromise);
        }

        return cachedResponse;
      }
    }

    return processRequest(
      handleRequest,
      App,
      url,
      request,
      sessionApi,
      options,
      response,
      hydrogenConfig
    );
  };

  if (__HYDROGEN_WORKER__) return handleRequest;

  return ((rawRequest, options) =>
    handleFetchResponseInNode(
      handleRequest(rawRequest, options),
      options.streamableResponse
    )) as RequestHandler;
};

async function processRequest(
  handleRequest: RequestHandler,
  App: any,
  url: URL,
  request: HydrogenRequest,
  sessionApi: any,
  options: RequestHandlerOptions,
  response: HydrogenResponse,
  hydrogenConfig: ResolvedHydrogenConfig,
  revalidate = false
) {
  const {dev, nonce, indexTemplate, streamableResponse: nodeResponse} = options;

  const log = getLoggerWithContext(request);
  const isRSCRequest = url.pathname === RSC_PATHNAME;
  const apiRoute = !isRSCRequest && getApiRoute(url, hydrogenConfig.routes);

  // The API Route might have a default export, making it also a server component
  // If it does, only render the API route if the request method is GET
  if (apiRoute && (!apiRoute.hasServerComponent || request.method !== 'GET')) {
    const apiResponse = await renderApiRoute(
      request,
      apiRoute,
      hydrogenConfig,
      {
        session: sessionApi,
      }
    );

    return apiResponse instanceof Request
      ? handleRequest(apiResponse, options)
      : apiResponse;
  }

  const state: Record<string, any> = isRSCRequest
    ? parseJSON(url.searchParams.get('state') || '{}')
    : {pathname: url.pathname, search: url.search};

  const rsc = runRSC({App, state, log, request, response});

  if (isRSCRequest) {
    const buffered = await bufferReadableStream(rsc.readable.getReader());
    postRequestTasks('rsc', 200, request, response);
    cacheResponse(response, request, [buffered], revalidate);

    return new Response(buffered, {
      headers: {'cache-control': response.cacheControlHeader},
    });
  }

  if (isBotUA(url, request.headers.get('user-agent'))) {
    response.doNotStream();
  }

  return runSSR({
    log,
    dev,
    rsc,
    nonce,
    state,
    request,
    response,
    nodeResponse,
    template: await getTemplate(indexTemplate, url),
    revalidate,
  });
}

async function getTemplate(
  indexTemplate:
    | string
    | ((url: string) => Promise<string | {default: string}>),
  url: URL
) {
  let template =
    typeof indexTemplate === 'function'
      ? await indexTemplate(url.toString())
      : indexTemplate;

  if (template && typeof template !== 'string') {
    template = template.default;
  }

  return template;
}

function getApiRoute(url: URL, routes: ResolvedHydrogenRoutes) {
  const apiRoutes = getApiRoutes(routes);
  return getApiRouteFromURL(url, apiRoutes);
}

function assembleHtml({
  ssrHtml,
  rscPayload,
  request,
  template,
}: AssembleHtmlParams) {
  let html = applyHtmlHead(ssrHtml, request.ctx.head, template);

  if (rscPayload) {
    html = html.replace(
      '</body>',
      // This must be a function to avoid replacing
      // special patterns like `$1` in `String.replace`.
      () => flightContainer(rscPayload) + '</body>'
    );
  }

  return html;
}

/**
 * Run the SSR/Fizz part of the App. If streaming is disabled,
 * this buffers the output and applies SEO enhancements.
 */
async function runSSR({
  rsc,
  state,
  request,
  response,
  nodeResponse,
  template,
  nonce,
  dev,
  log,
  revalidate,
}: RunSsrParams) {
  let ssrDidError: Error | undefined;
  const didError = () => rsc.didError() ?? ssrDidError;

  const [rscReadableForFizz, rscReadableForFlight] = rsc.readable.tee();
  const rscResponse = createFromReadableStream(rscReadableForFizz);
  const RscConsumer = () => rscResponse.readRoot();

  const {noScriptTemplate, bootstrapScripts, bootstrapModules} =
    stripScriptsFromTemplate(template);

  const AppSSR = (
    <Html
      template={response.canStream() ? noScriptTemplate : template}
      hydrogenConfig={request.ctx.hydrogenConfig!}
    >
      <ServerRequestProvider request={request}>
        <ServerPropsProvider
          initialServerProps={state as any}
          setServerPropsForRsc={() => {}}
        >
          <Suspense fallback={null}>
            <RscConsumer />
          </Suspense>
        </ServerPropsProvider>
      </ServerRequestProvider>
    </Html>
  );

  log.trace('start ssr');

  const rscReadable = response.canStream()
    ? new ReadableStream({
        start(controller) {
          log.trace('rsc start chunks');
          const encoder = new TextEncoder();
          bufferReadableStream(rscReadableForFlight.getReader(), (chunk) => {
            const metaTag = flightContainer(chunk);
            controller.enqueue(encoder.encode(metaTag));
          }).then(() => {
            log.trace('rsc finish chunks');
            return controller.close();
          });
        },
      })
    : rscReadableForFlight;

  if (__HYDROGEN_WORKER__) {
    const encoder = new TextEncoder();
    const transform = new TransformStream();
    const writable = transform.writable.getWriter();
    const responseOptions = {} as ResponseOptions;
    const savedChunks = tagOnWrite(writable);

    let ssrReadable: Awaited<ReturnType<typeof ssrRenderToReadableStream>>;

    try {
      ssrReadable = await ssrRenderToReadableStream(AppSSR, {
        nonce,
        bootstrapScripts,
        bootstrapModules,
        onError(error) {
          ssrDidError = error as Error;

          if (dev && !writable.closed && !!responseOptions.status) {
            writable.write(getErrorMarkup(error as Error));
          }

          log.error(error);
        },
      });
    } catch (error: unknown) {
      log.error(error);

      return new Response(
        template + (dev ? getErrorMarkup(error as Error) : ''),
        {
          status: 500,
          headers: {[CONTENT_TYPE]: HTML_CONTENT_TYPE},
        }
      );
    }

    if (response.canStream()) log.trace('worker ready to stream');
    ssrReadable.allReady.then(() => log.trace('worker complete ssr'));

    const prepareForStreaming = () => {
      Object.assign(responseOptions, getResponseOptions(response, didError()));

      /**
       * TODO: This assumes `response.cache()` has been called _before_ any
       * queries which might be caught behind Suspense. Clarify this or add
       * additional checks downstream?
       */
      /**
       * TODO: Also add `Vary` headers for `accept-language` and any other keys
       * we want to shard our full-page cache for all Hydrogen storefronts.
       */
      responseOptions.headers.set('cache-control', response.cacheControlHeader);

      if (isRedirect(responseOptions)) {
        return false;
      }

      responseOptions.headers.set(CONTENT_TYPE, HTML_CONTENT_TYPE);
      writable.write(encoder.encode(DOCTYPE));

      const error = didError();
      if (error) {
        // This error was delayed until the headers were properly sent.
        writable.write(encoder.encode(dev ? getErrorMarkup(error) : template));
      }

      return true;
    };

    const shouldFlushBody = response.canStream()
      ? prepareForStreaming()
      : await ssrReadable.allReady.then(prepareForStreaming);

    if (shouldFlushBody) {
      let bufferedSsr = '';
      let isPendingSsrWrite = false;

      const writingSSR = bufferReadableStream(
        ssrReadable.getReader(),
        response.canStream()
          ? (chunk) => {
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
          : undefined
      );

      const writingRSC = bufferReadableStream(
        rscReadable.getReader(),
        response.canStream()
          ? (scriptTag) => writable.write(encoder.encode(scriptTag))
          : undefined
      );

      Promise.all([writingSSR, writingRSC]).then(([ssrHtml, rscPayload]) => {
        if (!response.canStream()) {
          const html = assembleHtml({ssrHtml, rscPayload, request, template});
          writable.write(encoder.encode(html));
        }

        // Last SSR write might be pending, delay closing the writable one tick
        setTimeout(() => {
          writable.close();
          postRequestTasks('str', responseOptions.status, request, response);
          cacheResponse(response, request, savedChunks, revalidate);
        }, 0);
      });
    } else {
      // Redirects do not write body
      writable.close();
      postRequestTasks('str', responseOptions.status, request, response);
    }

    if (response.canStream()) {
      return new Response(transform.readable, responseOptions);
    }

    const bufferedBody = await bufferReadableStream(
      transform.readable.getReader()
    );

    return new Response(bufferedBody, responseOptions);
  } else if (nodeResponse) {
    const savedChunks = tagOnWrite(nodeResponse);

    nodeResponse.on('finish', () => {
      cacheResponse(response, request, savedChunks, revalidate);
    });

    const {pipe} = ssrRenderToPipeableStream(AppSSR, {
      nonce,
      bootstrapScripts,
      bootstrapModules,
      onShellReady() {
        log.trace('node ready to stream');

        /**
         * TODO: This assumes `response.cache()` has been called _before_ any
         * queries which might be caught behind Suspense. Clarify this or add
         * additional checks downstream?
         */
        writeHeadToNodeResponse(nodeResponse, response, log, didError());

        if (isRedirect(nodeResponse)) {
          // Return redirects early without further rendering/streaming
          return nodeResponse.end();
        }

        if (!response.canStream()) return;

        startWritingToNodeResponse(nodeResponse, dev ? didError() : undefined);

        setTimeout(() => {
          log.trace('node pipe response');
          if (!nodeResponse.writableEnded) pipe(nodeResponse);
        }, 0);

        bufferReadableStream(rscReadable.getReader(), (chunk) => {
          log.trace('rsc chunk');
          if (!nodeResponse.writableEnded) nodeResponse.write(chunk);
        });
      },
      async onAllReady() {
        log.trace('node complete ssr');

        if (
          !revalidate &&
          (response.canStream() || nodeResponse.writableEnded)
        ) {
          postRequestTasks('str', nodeResponse.statusCode, request, response);
          return;
        }

        writeHeadToNodeResponse(nodeResponse, response, log, didError());

        if (isRedirect(nodeResponse)) {
          // Redirects found after any async code
          return nodeResponse.end();
        }

        const bufferedResponse = await createNodeWriter();
        const bufferedRscPromise = bufferReadableStream(
          rscReadable.getReader()
        );

        let ssrHtml = '';
        bufferedResponse.on('data', (chunk) => (ssrHtml += chunk.toString()));
        bufferedResponse.once('error', (error) => (ssrDidError = error));
        bufferedResponse.once('end', async () => {
          const rscPayload = await bufferedRscPromise;

          const error = didError();
          startWritingToNodeResponse(nodeResponse, dev ? error : undefined);

          let html = template;

          if (!error) {
            html = assembleHtml({ssrHtml, rscPayload, request, template});
            postRequestTasks('ssr', nodeResponse.statusCode, request, response);
          }

          if (!nodeResponse.writableEnded) {
            nodeResponse.write(html);
            nodeResponse.end();
          }
        });

        pipe(bufferedResponse);
      },
      onShellError(error: any) {
        log.error(error);

        if (!nodeResponse.writableEnded) {
          writeHeadToNodeResponse(nodeResponse, response, log, error);
          startWritingToNodeResponse(nodeResponse, dev ? error : undefined);

          nodeResponse.write(template);
          nodeResponse.end();
        }
      },
      onError(error: any) {
        if (error.message?.includes('stream closed early')) {
          // This seems to happen when Fizz is still streaming
          // but nodeResponse has been closed by the browser.
          // This is common in tests and during development
          // due to frequent page refresh.
          return;
        }

        ssrDidError = error;

        if (dev && nodeResponse.headersSent && !nodeResponse.writableEnded) {
          // Calling write would flush headers automatically.
          // Delay this error until headers are properly sent.
          nodeResponse.write(getErrorMarkup(error));
        }

        log.error(error);
      },
    });
  }
}

/**
 * Run the RSC/Flight part of the App
 */
function runRSC({App, state, log, request, response}: RunRscParams) {
  const serverProps = {...state, request, response, log};
  request.ctx.router.serverProps = serverProps;
  preloadRequestCacheData(request);

  const AppRSC = (
    <ServerRequestProvider request={request}>
      <App {...serverProps} />
      <Suspense fallback={null}>
        <Analytics />
      </Suspense>
      {request.ctx.hydrogenConfig?.__EXPERIMENTAL__devTools && (
        <Suspense fallback={null}>
          <DevTools />
        </Suspense>
      )}
    </ServerRequestProvider>
  );

  let rscDidError: Error;
  const rscReadable = rscRenderToReadableStream(AppRSC, {
    onError(e) {
      rscDidError = e;
      log.error(e);
    },
  });

  return {readable: rscReadable, didError: () => rscDidError};
}

export default renderHydrogen;

function startWritingToNodeResponse(
  nodeResponse: ServerResponse,
  error?: Error
) {
  if (nodeResponse.writableEnded) return;

  if (!nodeResponse.headersSent) {
    nodeResponse.setHeader(CONTENT_TYPE, HTML_CONTENT_TYPE);
    nodeResponse.write(DOCTYPE);
  }

  if (error) {
    // This error was delayed until the headers were properly sent.
    nodeResponse.write(getErrorMarkup(error));
  }
}

type ResponseOptions = {
  headers: Headers;
  status: number;
  statusText?: string;
};

function getResponseOptions(
  {headers, status, statusText}: HydrogenResponse,
  error?: Error
) {
  const responseInit = {
    headers,
    status: error ? 500 : status,
  } as ResponseOptions;

  if (!error && statusText) {
    responseInit.statusText = statusText;
  }

  return responseInit;
}

function writeHeadToNodeResponse(
  nodeResponse: ServerResponse,
  componentResponse: HydrogenResponse,
  log: Logger,
  error?: Error
) {
  if (nodeResponse.headersSent) return;
  log.trace('writeHeadToNodeResponse');

  /**
   * TODO: Also add `Vary` headers for `accept-language` and any other keys
   * we want to shard our full-page cache for all Hydrogen storefronts.
   */
  nodeResponse.setHeader('cache-control', componentResponse.cacheControlHeader);

  const {headers, status, statusText} = getResponseOptions(
    componentResponse,
    error
  );

  nodeResponse.statusCode = status;

  if (statusText) {
    nodeResponse.statusMessage = statusText;
  }

  setNodeHeaders(headers, nodeResponse);
}

function isRedirect(response: {status?: number; statusCode?: number}) {
  const status = response.status ?? response.statusCode ?? 0;
  return status >= 300 && status < 400;
}

async function createNodeWriter() {
  // Importing 'stream' directly breaks Vite resolve
  // when building for workers, even though this code
  // does not run in a worker. Looks like tree-shaking
  // kicks in after the import analysis/bundle.
  const streamImport = __HYDROGEN_WORKER__ ? '' : 'stream';
  const {PassThrough} = await import(streamImport);
  return new PassThrough() as InstanceType<typeof PassThroughType>;
}

function flightContainer(chunk: string) {
  return `<meta data-flight="${htmlEncode(chunk)}" />`;
}

function postRequestTasks(
  type: RenderType,
  status: number,
  request: HydrogenRequest,
  response: HydrogenResponse
) {
  logServerResponse(type, request, status);
  logCacheControlHeaders(type, request, response);
  logQueryTimings(type, request);
  request.savePreloadQueries();
}

/**
 * Ensure Node.js environments handle the fetch Response correctly.
 */
function handleFetchResponseInNode(
  fetchResponsePromise: Promise<Response | undefined>,
  nodeResponse?: ServerResponse
) {
  if (nodeResponse) {
    fetchResponsePromise.then((response) => {
      if (!response || nodeResponse.writableEnded) return;

      setNodeHeaders(response.headers, nodeResponse);

      nodeResponse.statusCode = response.status;

      if (response.body) {
        if (response.body instanceof ReadableStream) {
          bufferReadableStream(response.body.getReader(), (chunk) => {
            nodeResponse.write(chunk);
          }).then(() => nodeResponse.end());
        } else {
          nodeResponse.write(response.body);
          nodeResponse.end();
        }
      } else {
        nodeResponse.end();
      }
    });
  }

  return fetchResponsePromise;
}

/**
 * Convert Headers to outgoing Node.js headers.
 * Specifically, parse set-cookie headers to split them properly as separate
 * `set-cookie` headers rather than a single, combined header.
 */
function setNodeHeaders(headers: Headers, nodeResponse: ServerResponse) {
  for (const [key, value] of headers.entries()) {
    if (key.toLowerCase() === 'set-cookie') {
      nodeResponse.setHeader(key, splitCookiesString(value));
    } else {
      nodeResponse.setHeader(key, value);
    }
  }
}

function tagOnWrite(
  response: ServerResponse | WritableStreamDefaultWriter<any>
) {
  const originalWrite = response.write;
  const decoder = new TextDecoder();
  const savedChunks: string[] = [];

  response.write = (arg: any) => {
    if (arg instanceof Uint8Array) {
      savedChunks.push(decoder.decode(arg));
    } else {
      savedChunks.push(arg);
    }
    // @ts-ignore
    return originalWrite.apply(response, [arg]);
  };

  return savedChunks;
}

async function cacheResponse(
  response: HydrogenResponse,
  request: HydrogenRequest,
  chunks: string[],
  revalidate?: Boolean
) {
  const cache = getCache();

  /**
   * Only cache on cachable responses where response
   *
   * - have content to cache
   * - have status 200
   * - does not have no-store on cache-control header
   * - does not have set-cookie header
   * - is not a POST request
   * - does not have a session or does not have an active customer access token
   */
  if (
    cache &&
    chunks.length > 0 &&
    response.status === 200 &&
    response.cache().mode !== NO_STORE &&
    !response.headers.has('Set-Cookie') &&
    !/post/i.test(request.method) &&
    !sessionHasCustomerAccessToken(request)
  ) {
    if (revalidate) {
      await saveCacheResponse(response, request, chunks);
    } else {
      const cachePutPromise = Promise.resolve(true).then(() =>
        saveCacheResponse(response, request, chunks)
      );
      request.ctx.runtime?.waitUntil(cachePutPromise);
    }
  }
}

function sessionHasCustomerAccessToken(request: HydrogenRequest) {
  const session = request.ctx.session;
  // Need to wrap this in a try catch because session.get can
  // throw a promise if it is not ready
  try {
    const sessionData = session?.get();
    return sessionData && sessionData['customerAccessToken'];
  } catch (error) {
    return false;
  }
}

async function saveCacheResponse(
  response: HydrogenResponse,
  request: HydrogenRequest,
  chunks: string[]
) {
  const cache = getCache();

  if (cache && chunks.length > 0) {
    const {headers, status, statusText} = getResponseOptions(response);
    const url = new URL(request.url);

    headers.set('cache-control', response.cacheControlHeader);
    const currentHeader = headers.get('Content-Type');
    if (!currentHeader && url.pathname !== RSC_PATHNAME) {
      headers.set('Content-Type', HTML_CONTENT_TYPE);
    }

    await setItemInCache(
      request.cacheKey(),
      new Response(chunks.join(''), {
        status,
        statusText,
        headers,
      }),
      response.cache()
    );
    deleteItemFromCache(request.cacheKey(true));
  }
}
