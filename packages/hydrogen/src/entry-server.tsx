import React, {Suspense} from 'react';
import {
  Logger,
  logServerResponse,
  logCacheControlHeaders,
  logQueryTimings,
  getLoggerWithContext,
} from './utilities/log';
import {getErrorMarkup} from './utilities/error';
import {defer} from './utilities/defer';
import type {
  RendererOptions,
  StreamerOptions,
  HydratorOptions,
  HydrogenConfig,
} from './types';
import {Html, applyHtmlHead} from './framework/Hydration/Html';
import {ServerComponentResponse} from './framework/Hydration/ServerComponentResponse.server';
import {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import {
  preloadRequestCacheData,
  ServerRequestProvider,
} from './foundation/ServerRequestProvider';
import type {ServerResponse, IncomingMessage} from 'http';
import type {PassThrough as PassThroughType, Writable} from 'stream';
import {
  getApiRouteFromURL,
  renderApiRoute,
  getApiRoutes,
} from './utilities/apiRoutes';
import {ServerPropsProvider} from './foundation/ServerPropsProvider';
import {isBotUA} from './utilities/bot-ua';
import {setContext, setCache, RuntimeContext} from './framework/runtime';
import {setConfig} from './framework/config';
import {
  ssrRenderToPipeableStream,
  ssrRenderToReadableStream,
  rscRenderToReadableStream,
  createFromReadableStream,
  isStreamingSupported,
  bufferReadableStream,
} from './streaming.server';
import {RSC_PATHNAME, EVENT_PATHNAME, EVENT_PATHNAME_REGEX} from './constants';
import {stripScriptsFromTemplate} from './utilities/template';
import {RenderType} from './utilities/log/log';
import {Analytics} from './foundation/Analytics/Analytics.server';
import {ServerAnalyticsRoute} from './foundation/Analytics/ServerAnalyticsRoute.server';
import {getSyncSessionApi} from './foundation/session/session';
import {parseJSON} from './utilities/parse';

declare global {
  // This is provided by a Vite plugin
  // and will trigger tree-shaking.
  // eslint-disable-next-line no-var
  var __WORKER__: boolean;
}

const DOCTYPE = '<!DOCTYPE html>';
const CONTENT_TYPE = 'Content-Type';
const HTML_CONTENT_TYPE = 'text/html; charset=UTF-8';

interface RequestHandlerOptions {
  indexTemplate:
    | string
    | ((url: string) => Promise<string | {default: string}>);
  cache?: Cache;
  streamableResponse?: ServerResponse;
  dev?: boolean;
  context?: RuntimeContext;
  nonce?: string;
  buyerIpHeader?: string;
}

export interface RequestHandler {
  (request: Request | IncomingMessage, options: RequestHandlerOptions): Promise<
    Response | undefined
  >;
}

export const renderHydrogen = (App: any, hydrogenConfig?: HydrogenConfig) => {
  const handleRequest: RequestHandler = async function (rawRequest, options) {
    const {
      indexTemplate,
      streamableResponse,
      dev,
      cache,
      context,
      nonce,
      buyerIpHeader,
    } = options;

    const request = new ServerComponentRequest(rawRequest);
    const url = new URL(request.url);

    if (!hydrogenConfig) {
      // @ts-ignore
      // eslint-disable-next-line node/no-missing-import
      const configFile = await import('virtual:hydrogen-config');
      hydrogenConfig = configFile.default as HydrogenConfig;
    }

    request.ctx.hydrogenConfig = hydrogenConfig;
    request.ctx.buyerIpHeader = buyerIpHeader;

    const log = getLoggerWithContext(request);
    const sessionApi = hydrogenConfig.session
      ? hydrogenConfig.session(log)
      : undefined;
    const componentResponse = new ServerComponentResponse();

    request.ctx.session = getSyncSessionApi(
      request,
      componentResponse,
      log,
      sessionApi
    );

    /**
     * Inject the cache & context into the module loader so we can pull it out for subrequests.
     */
    setCache(cache);
    setContext(context);
    setConfig({dev});

    if (
      url.pathname === EVENT_PATHNAME ||
      EVENT_PATHNAME_REGEX.test(url.pathname)
    ) {
      return ServerAnalyticsRoute(
        request,
        hydrogenConfig.serverAnalyticsConnectors
      );
    }

    const isReactHydrationRequest = url.pathname === RSC_PATHNAME;

    if (!isReactHydrationRequest && hydrogenConfig.routes) {
      const apiRoute = getApiRoute(url, hydrogenConfig.routes);

      // The API Route might have a default export, making it also a server component
      // If it does, only render the API route if the request method is GET
      if (
        apiRoute &&
        (!apiRoute.hasServerComponent || request.method !== 'GET')
      ) {
        const apiResponse = await renderApiRoute(
          request,
          apiRoute,
          hydrogenConfig.shopify,
          sessionApi
        );

        return apiResponse instanceof Request
          ? handleRequest(apiResponse, options)
          : apiResponse;
      }
    }

    const isStreamable =
      !isBotUA(url, request.headers.get('user-agent')) &&
      (!!streamableResponse || (await isStreamingSupported()));

    let template =
      typeof indexTemplate === 'function'
        ? await indexTemplate(url.toString())
        : indexTemplate;

    if (template && typeof template !== 'string') {
      template = template.default;
    }

    const params = {
      App,
      log,
      dev,
      nonce,
      request,
      template,
      isStreamable,
      componentResponse,
      response: streamableResponse,
    };

    if (isReactHydrationRequest) {
      return hydrate(url, params);
    }

    /**
     * Stream back real-user responses, but for bots/etc,
     * use `render` instead. This is because we need to inject <head>
     * things for SEO reasons.
     */
    if (isStreamable) {
      return stream(url, params);
    }

    return render(url, params);
  };

  return handleRequest;
};

function getApiRoute(url: URL, routes: NonNullable<HydrogenConfig['routes']>) {
  const apiRoutes = getApiRoutes(routes!);
  return getApiRouteFromURL(url, apiRoutes);
}

/**
 * The render function is responsible for turning the provided `App` into an HTML string,
 * and returning any initial state that needs to be hydrated into the client version of the app.
 * NOTE: This is currently only used for SEO bots or Worker runtime (where Stream is not yet supported).
 */
async function render(
  url: URL,
  {App, request, template, componentResponse, nonce, log}: RendererOptions
) {
  const state = {pathname: url.pathname, search: url.search};

  const {AppSSR, rscReadable} = buildAppSSR(
    {
      App,
      log,
      state,
      request,
      response: componentResponse,
    },
    {template}
  );

  function onErrorShell(error: Error) {
    log.error(error);
    componentResponse.writeHead({status: 500});
    return template;
  }

  let [html, flight] = await Promise.all([
    renderToBufferedString(AppSSR, {log, nonce}).catch(onErrorShell),
    bufferReadableStream(rscReadable.getReader()).catch(() => null),
  ]);

  const {headers, status, statusText} = getResponseOptions(componentResponse);

  /**
   * TODO: Also add `Vary` headers for `accept-language` and any other keys
   * we want to shard our full-page cache for all Hydrogen storefronts.
   */
  headers.set('cache-control', componentResponse.cacheControlHeader);

  if (componentResponse.customBody) {
    // This can be used to return sitemap.xml or any other custom response.

    postRequestTasks('ssr', status, request, componentResponse);

    return new Response(await componentResponse.customBody, {
      status,
      statusText,
      headers,
    });
  }

  headers.set(CONTENT_TYPE, HTML_CONTENT_TYPE);

  html = applyHtmlHead(html, request.ctx.head, template);

  if (flight) {
    html = html.replace(
      '</body>',
      () => flightContainer(flight as string) + '</body>'
    );
  }

  postRequestTasks('ssr', status, request, componentResponse);

  return new Response(html, {
    status,
    statusText,
    headers,
  });
}

/**
 * Stream a response to the client. NOTE: This omits custom `<head>`
 * information, so this method should not be used by crawlers.
 */
async function stream(
  url: URL,
  {
    App,
    request,
    response,
    componentResponse,
    template,
    nonce,
    dev,
    log,
  }: StreamerOptions
) {
  const state = {pathname: url.pathname, search: url.search};
  log.trace('start stream');

  const {noScriptTemplate, bootstrapScripts, bootstrapModules} =
    stripScriptsFromTemplate(template);

  const {AppSSR, rscReadable} = buildAppSSR(
    {
      App,
      log,
      state,
      request,
      response: componentResponse,
    },
    {template: noScriptTemplate}
  );

  const rscToScriptTagReadable = new ReadableStream({
    start(controller) {
      log.trace('rsc start chunks');
      const encoder = new TextEncoder();
      bufferReadableStream(rscReadable.getReader(), (chunk) => {
        const scriptTag = flightContainer(chunk);
        controller.enqueue(encoder.encode(scriptTag));
      }).then(() => {
        log.trace('rsc finish chunks');
        return controller.close();
      });
    },
  });

  let didError: Error | undefined;

  if (__WORKER__) {
    const onCompleteAll = defer<true>();
    const encoder = new TextEncoder();
    const transform = new TransformStream();
    const writable = transform.writable.getWriter();
    const responseOptions = {} as ResponseOptions;

    let ssrReadable: Awaited<ReturnType<typeof ssrRenderToReadableStream>>;

    try {
      ssrReadable = await ssrRenderToReadableStream(AppSSR, {
        nonce,
        bootstrapScripts,
        bootstrapModules,
        onError(error) {
          didError = error;

          if (dev && !writable.closed && !!responseOptions.status) {
            writable.write(getErrorMarkup(error));
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

    log.trace('worker ready to stream');

    ssrReadable.allReady.then(() => {
      log.trace('worker complete stream');
      onCompleteAll.resolve(true);
    });

    /* eslint-disable no-inner-declarations */
    async function prepareForStreaming(flush: boolean) {
      Object.assign(
        responseOptions,
        getResponseOptions(componentResponse, didError)
      );

      /**
       * TODO: This assumes `response.cache()` has been called _before_ any
       * queries which might be caught behind Suspense. Clarify this or add
       * additional checks downstream?
       */
      responseOptions.headers.set(
        'cache-control',
        componentResponse.cacheControlHeader
      );

      if (isRedirect(responseOptions)) {
        return false;
      }

      if (flush) {
        if (componentResponse.customBody) {
          writable.write(encoder.encode(await componentResponse.customBody));
          return false;
        }

        responseOptions.headers.set(CONTENT_TYPE, HTML_CONTENT_TYPE);
        writable.write(encoder.encode(DOCTYPE));

        if (didError) {
          // This error was delayed until the headers were properly sent.
          writable.write(encoder.encode(getErrorMarkup(didError)));
        }

        return true;
      }
    }
    /* eslint-enable no-inner-declarations */

    const shouldReturnApp =
      (await prepareForStreaming(componentResponse.canStream())) ??
      (await onCompleteAll.promise.then(prepareForStreaming));

    if (shouldReturnApp) {
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
        postRequestTasks(
          'str',
          responseOptions.status,
          request,
          componentResponse
        );
      });
    } else {
      writable.close();
      postRequestTasks(
        'str',
        responseOptions.status,
        request,
        componentResponse
      );
    }

    if (await isStreamingSupported()) {
      return new Response(transform.readable, responseOptions);
    }

    const bufferedBody = await bufferReadableStream(
      transform.readable.getReader()
    );

    return new Response(bufferedBody, responseOptions);
  } else if (response) {
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
        response.setHeader(
          'cache-control',
          componentResponse.cacheControlHeader
        );

        writeHeadToServerResponse(response, componentResponse, log, didError);

        if (isRedirect(response)) {
          // Return redirects early without further rendering/streaming
          return response.end();
        }

        if (!componentResponse.canStream()) return;

        startWritingHtmlToServerResponse(response, dev ? didError : undefined);

        setTimeout(() => {
          log.trace('node pipe response');
          pipe(response);
        }, 0);

        bufferReadableStream(rscToScriptTagReadable.getReader(), (chunk) => {
          log.trace('rsc chunk');
          return response.write(chunk);
        });
      },
      async onAllReady() {
        log.trace('node complete stream');

        if (componentResponse.canStream() || response.writableEnded) {
          postRequestTasks(
            'str',
            response.statusCode,
            request,
            componentResponse
          );
          return;
        }

        writeHeadToServerResponse(response, componentResponse, log, didError);

        postRequestTasks(
          'str',
          response.statusCode,
          request,
          componentResponse
        );

        if (isRedirect(response)) {
          // Redirects found after any async code
          return response.end();
        }

        if (componentResponse.customBody) {
          return response.end(await componentResponse.customBody);
        }

        startWritingHtmlToServerResponse(response, dev ? didError : undefined);

        bufferReadableStream(rscToScriptTagReadable.getReader()).then(
          (scriptTags) => {
            // Piping ends the response so script tags
            // must be written before that.
            response.write(scriptTags);
            pipe(response);
          }
        );
      },
      onShellError(error: any) {
        log.error(error);

        if (!response.writableEnded) {
          writeHeadToServerResponse(response, componentResponse, log, error);
          startWritingHtmlToServerResponse(response, dev ? error : undefined);

          response.write(template);
          response.end();
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
  }
}

/**
 * Stream a hydration response to the client.
 */
async function hydrate(
  url: URL,
  {
    App,
    log,
    request,
    response,
    isStreamable,
    componentResponse,
  }: HydratorOptions
) {
  const state = parseJSON(url.searchParams.get('state') || '{}');

  const {AppRSC} = buildAppRSC({
    App,
    log,
    state,
    request,
    response: componentResponse,
  });

  if (__WORKER__) {
    const rscReadable = rscRenderToReadableStream(AppRSC);

    if (isStreamable && (await isStreamingSupported())) {
      postRequestTasks('rsc', 200, request, componentResponse);
      return new Response(rscReadable);
    }

    // Note: CFW does not support reader.piteTo nor iterable syntax
    const bufferedBody = await bufferReadableStream(rscReadable.getReader());

    postRequestTasks('rsc', 200, request, componentResponse);

    return new Response(bufferedBody, {
      headers: {
        'cache-control': componentResponse.cacheControlHeader,
      },
    });
  } else if (response) {
    const rscWriter = await import(
      // @ts-ignore
      '@shopify/hydrogen/vendor/react-server-dom-vite/writer.node.server'
    );

    const streamer = rscWriter.renderToPipeableStream(AppRSC);
    response.writeHead(200, 'ok', {
      'cache-control': componentResponse.cacheControlHeader,
    });
    const stream = streamer.pipe(response) as Writable;

    stream.on('finish', function () {
      postRequestTasks('rsc', response.statusCode, request, componentResponse);
    });
  }
}

type BuildAppOptions = {
  App: React.JSXElementConstructor<any>;
  state?: object | null;
  request: ServerComponentRequest;
  response: ServerComponentResponse;
  log: Logger;
};

function buildAppRSC({App, log, state, request, response}: BuildAppOptions) {
  const hydrogenServerProps = {request, response, log};
  const serverProps = {
    ...state,
    ...hydrogenServerProps,
  };

  request.ctx.router.serverProps = serverProps;

  const AppRSC = (
    <ServerRequestProvider request={request} isRSC={true}>
      <PreloadQueries request={request}>
        <App {...serverProps} />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </PreloadQueries>
    </ServerRequestProvider>
  );

  return {AppRSC};
}

function buildAppSSR(
  {App, state, request, response, log}: BuildAppOptions,
  htmlOptions: Omit<Parameters<typeof Html>[0], 'children'> & {}
) {
  const {AppRSC} = buildAppRSC({
    App,
    log,
    state,
    request,
    response,
  });

  const [rscReadableForFizz, rscReadableForFlight] =
    rscRenderToReadableStream(AppRSC).tee();

  const rscResponse = createFromReadableStream(rscReadableForFizz);
  const RscConsumer = () => rscResponse.readRoot();

  const AppSSR = (
    <Html {...htmlOptions}>
      <ServerRequestProvider request={request} isRSC={false}>
        <ServerPropsProvider
          initialServerProps={state as any}
          setServerPropsForRsc={() => {}}
        >
          <PreloadQueries request={request}>
            <Suspense fallback={null}>
              <RscConsumer />
            </Suspense>
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
          </PreloadQueries>
        </ServerPropsProvider>
      </ServerRequestProvider>
    </Html>
  );

  return {AppSSR, rscReadable: rscReadableForFlight};
}

function PreloadQueries({
  request,
  children,
}: {
  request: ServerComponentRequest;
  children: React.ReactNode;
}) {
  const preloadQueries = request.getPreloadQueries();
  preloadRequestCacheData(request, preloadQueries);

  return <>{children}</>;
}

async function renderToBufferedString(
  ReactApp: JSX.Element,
  {log, nonce}: {log: Logger; nonce?: string}
): Promise<string> {
  if (__WORKER__) {
    const ssrReadable = await ssrRenderToReadableStream(ReactApp, {
      nonce,
      onError: (error) => log.error(error),
    });

    /**
     * We want to wait until `allReady` resolves before fetching the
     * stream body. Otherwise, React 18's streaming JS script/template tags
     * will be included in the output and cause issues when loading
     * the Client Components in the browser.
     */
    await ssrReadable.allReady;

    return bufferReadableStream(ssrReadable.getReader());
  } else {
    const writer = await createNodeWriter();

    return new Promise<string>((resolve, reject) => {
      const {pipe} = ssrRenderToPipeableStream(ReactApp, {
        nonce,
        /**
         * When hydrating, we have to wait until `onCompleteAll` to avoid having
         * `template` and `script` tags inserted and rendered as part of the hydration response.
         */
        onAllReady() {
          let data = '';
          writer.on('data', (chunk) => (data += chunk.toString()));
          writer.once('error', reject);
          writer.once('end', () => resolve(data));
          // Tell React to start writing to the writer
          pipe(writer);
        },
        onShellError: reject,
        onError: (error) => log.error(error),
      });
    });
  }
}

export default renderHydrogen;

function startWritingHtmlToServerResponse(
  response: ServerResponse,
  error?: Error
) {
  if (!response.headersSent) {
    response.setHeader(CONTENT_TYPE, HTML_CONTENT_TYPE);
    response.write(DOCTYPE);
  }

  if (error) {
    // This error was delayed until the headers were properly sent.
    response.write(getErrorMarkup(error));
  }
}

type ResponseOptions = {
  headers: Headers;
  status: number;
  statusText?: string;
};

function getResponseOptions(
  {headers, status, customStatus}: ServerComponentResponse,
  error?: Error
) {
  const responseInit = {} as ResponseOptions;

  responseInit.headers = headers;

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

  Object.entries((headers as any).raw()).forEach(([key, value]) =>
    response.setHeader(key, value as string)
  );
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
  const streamImport = __WORKER__ ? '' : 'stream';
  const {PassThrough} = await import(streamImport);
  return new PassThrough() as InstanceType<typeof PassThroughType>;
}

function flightContainer(chunk: string) {
  return `<meta data-flight="${encodeURIComponent(chunk)}" />`;
}

function postRequestTasks(
  type: RenderType,
  status: number,
  request: ServerComponentRequest,
  componentResponse: ServerComponentResponse
) {
  logServerResponse(type, request, status);
  logCacheControlHeaders(type, request, componentResponse);
  logQueryTimings(type, request);
  request.savePreloadQueries();
}
