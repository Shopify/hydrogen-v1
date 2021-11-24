import {IncomingMessage, NextFunction} from 'connect';
import http from 'http';
import {ViteDevServer} from 'vite';
import {ShopifyConfig} from '../types';
import {graphiqlHtml} from './graphiql';
import handleEvent from '../handle-event';

type HydrogenMiddlewareArgs = {
  dev?: boolean;
  shopifyConfig?: ShopifyConfig;
  indexTemplate: string | ((url: string) => Promise<string>);
  getServerEntrypoint: () => Record<string, any> | Promise<Record<string, any>>;
  devServer?: ViteDevServer;
  cache?: Cache;
  secrets?: Record<string, any>;
};

export function graphiqlMiddleware({
  shopifyConfig,
  dev,
}: {
  shopifyConfig: ShopifyConfig;
  dev: boolean;
}) {
  return async function (
    request: IncomingMessage,
    response: http.ServerResponse,
    next: NextFunction
  ) {
    const graphiqlRequest = dev && isGraphiqlRequest(request);

    if (graphiqlRequest) {
      return respondWithGraphiql(response, shopifyConfig);
    }

    next();
  };
}

/**
 * Provides middleware to Node.js Express-like servers. Used by the Hydrogen
 * Vite dev server plugin as well as production Node.js implementation.
 */
export function hydrogenMiddleware({
  dev,
  cache,
  indexTemplate,
  getServerEntrypoint,
  devServer,
  secrets,
}: HydrogenMiddlewareArgs) {
  return async function (
    request: IncomingMessage,
    response: http.ServerResponse,
    next: NextFunction
  ) {
    const url = new URL('http://' + request.headers.host + request.originalUrl);

    const isReactHydrationRequest = url.pathname === '/react';

    /**
     * If it's a dev environment, it's assumed that Vite's dev server is handling
     * any static or JS requests, so we need to ensure that we don't try to handle them.
     *
     * If it's a product environment, it's assumed that the developer is handling
     * static requests with e.g. static middleware.
     */
    if (dev && !shouldInterceptRequest(request, isReactHydrationRequest)) {
      return next();
    }

    try {
      /**
       * We're running in the Node.js runtime without access to `fetch`,
       * which is needed for proxy requests and server-side API requests.
       */
      if (!globalThis.fetch) {
        const fetch = await import('node-fetch');
        // @ts-ignore
        globalThis.fetch = fetch.default;
        // @ts-ignore
        globalThis.Request = fetch.Request;
        // @ts-ignore
        globalThis.Response = fetch.Response;
        // @ts-ignore
        globalThis.Headers = fetch.Headers;
      }

      /**
       * Dynamically import ServerComponentResponse after the `fetch`
       * polyfill has loaded above.
       */
      const {ServerComponentRequest} = await import(
        './Hydration/ServerComponentRequest.server'
      );

      const eventResponse = await handleEvent(
        /**
         * Mimic a `FetchEvent`
         */
        {},
        {
          request: new ServerComponentRequest(request),
          entrypoint: await getServerEntrypoint(),
          indexTemplate,
          streamableResponse: response,
          dev,
          cache,
          secrets,
        }
      );

      /**
       * If a `Response` was returned, that means it was not streamed.
       * Convert the response into a proper Node.js response.
       */
      if (eventResponse) {
        eventResponse.headers.forEach((value, key) => {
          response.setHeader(key, value);
        });

        response.statusCode = eventResponse.status;
        response.end(eventResponse.body);
      }
    } catch (e: any) {
      if (dev && devServer) devServer.ssrFixStacktrace(e);
      console.log(e.stack);
      response.statusCode = 500;

      /**
       * Attempt to print the error stack within the template.
       * This allows the react-refresh plugin and other Vite runtime helpers
       * to display the error and auto-refresh when the error is fixed, instead
       * of a white screen that needs a manual refresh.
       */
      try {
        const template =
          typeof indexTemplate === 'function'
            ? await indexTemplate(url.toString())
            : indexTemplate;
        const html = template.replace(
          `<div id="root"></div>`,
          `<div id="root"><pre><code>${e.stack}</code></pre></div>`
        );

        response.write(html);
        next(e);
      } catch (_e) {
        // If template loading is the culprit, give up and just return the error stack.
        response.write(e.stack);
        next(e);
      }
    }
  };
}

function shouldInterceptRequest(
  request: IncomingMessage,
  isReactHydrationRequest: boolean
) {
  return (
    /text\/html|application\/hydrogen/.test(request.headers['accept'] ?? '') ||
    isReactHydrationRequest
  );
}

/**
 * /graphiql and /___graphql are supported
 */
function isGraphiqlRequest(request: IncomingMessage) {
  return /^\/(?:_{3})?graphi?ql/.test(request.url || '');
}

async function respondWithGraphiql(
  response: http.ServerResponse,
  shopifyConfig?: ShopifyConfig
) {
  if (!shopifyConfig) {
    throw new Error(
      "You must provide shopifyConfig to Hydrogen's Vite middleware"
    );
  }

  const {storeDomain, storefrontToken, graphqlApiVersion} = shopifyConfig;

  response.setHeader('Content-Type', 'text/html');
  response.end(
    graphiqlHtml(
      storeDomain?.replace(/^https?:\/\//, ''),
      storefrontToken,
      graphqlApiVersion
    )
  );
}
