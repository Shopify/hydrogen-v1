import type {RequestHandler} from '../entry-server';
import type {IncomingMessage, NextFunction} from 'connect';
import type {ServerResponse} from 'http';
import type {ViteDevServer} from 'vite';
import type {ShopifyConfig} from '../types';
import {graphiqlHtml} from './graphiql';

type HydrogenMiddlewareArgs = {
  dev?: boolean;
  shopifyConfig?: ShopifyConfig;
  indexTemplate: string | ((url: string) => Promise<string>);
  getServerEntrypoint: () => RequestHandler | Promise<RequestHandler>;
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
    response: ServerResponse,
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
    response: ServerResponse,
    next: NextFunction
  ) {
    const url = new URL(
      'http://' + request.headers.host + (request.originalUrl ?? request.url)
    );

    try {
      /**
       * We're running in the Node.js runtime without access to `fetch`,
       * which is needed for proxy requests and server-side API requests.
       */
      if (!globalThis.fetch) {
        const fetch = await import('node-fetch');
        const {default: AbortController} = await import('abort-controller');
        // @ts-ignore
        globalThis.fetch = fetch;
        // @ts-ignore
        globalThis.Request = fetch.Request;
        // @ts-ignore
        globalThis.Response = fetch.Response;
        // @ts-ignore
        globalThis.Headers = fetch.Headers;
        // @ts-ignore
        globalThis.AbortController = AbortController;
      }

      if (!globalThis.ReadableStream) {
        const {ReadableStream, WritableStream, TransformStream} = await import(
          'web-streams-polyfill/ponyfill'
        );

        Object.assign(globalThis, {
          ReadableStream,
          WritableStream,
          TransformStream,
        });
      }

      const handleRequest = await getServerEntrypoint();

      const eventResponse = await handleRequest(request, {
        dev,
        cache,
        indexTemplate,
        streamableResponse: response,
      });

      /**
       * If a `Response` was returned, that means it was not streamed.
       * Convert the response into a proper Node.js response.
       */
      if (eventResponse) {
        eventResponse.headers.forEach((value: string, key: string) => {
          response.setHeader(key, value);
        });

        response.statusCode = eventResponse.status;

        if (eventResponse.body) {
          response.write(eventResponse.body);
        }

        response.end();
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
  response: ServerResponse,
  shopifyConfig?: ShopifyConfig
) {
  if (!shopifyConfig) {
    throw new Error(
      "You must provide shopifyConfig to Hydrogen's Vite middleware"
    );
  }

  const {storeDomain, storefrontToken, storefrontApiVersion} = shopifyConfig;

  response.setHeader('Content-Type', 'text/html');
  response.end(
    graphiqlHtml(
      storeDomain?.replace(/^https?:\/\//, ''),
      storefrontToken,
      storefrontApiVersion
    )
  );
}
