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
}: HydrogenMiddlewareArgs) {
  return async function (
    request: IncomingMessage,
    response: http.ServerResponse,
    next: NextFunction
  ) {
    const url = new URL('http://' + request.headers.host + request.originalUrl);

    try {
      /**
       * We're running in the Node.js runtime without access to `fetch`,
       * which is needed for proxy requests and server-side API requests.
       */
      if (!globalThis.fetch) {
        const {fetch, Request, Response, Headers} = await import('undici');
        const {default: AbortController} = await import('abort-controller');
        // @ts-ignore
        globalThis.fetch = fetch;
        // @ts-ignore
        globalThis.Request = Request;
        // @ts-ignore
        globalThis.Response = Response;
        // @ts-ignore
        globalThis.Headers = Headers;
        // @ts-ignore
        globalThis.AbortController = AbortController;
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

        if (eventResponse.body) {
          const reader = eventResponse.body.getReader();

          while (true) {
            const {done, value} = await reader.read();
            if (done) return response.end();
            response.write(value);
          }
        } else {
          response.end();
        }
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
