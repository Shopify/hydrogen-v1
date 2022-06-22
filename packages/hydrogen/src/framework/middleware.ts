import type {RequestHandler, ShopifyConfig} from '../shared-types';
import type {IncomingMessage, NextFunction} from 'connect';
import type {ServerResponse} from 'http';
import type {ViteDevServer} from 'vite';
import {graphiqlHtml} from './graphiql';

type HydrogenMiddlewareArgs = {
  dev?: boolean;
  indexTemplate: string | ((url: string) => Promise<string>);
  getServerEntrypoint: () => any;
  devServer?: ViteDevServer;
  cache?: Cache;
};

export function graphiqlMiddleware({
  getShopifyConfig,
  dev,
}: {
  getShopifyConfig: (
    request: IncomingMessage
  ) => ShopifyConfig | Promise<ShopifyConfig>;
  dev?: boolean;
}) {
  return async function (
    request: IncomingMessage,
    response: ServerResponse,
    next: NextFunction
  ) {
    if (dev && isGraphiqlRequest(request)) {
      const shopifyConfig = await getShopifyConfig(request);
      return respondWithGraphiql(response, shopifyConfig);
    }

    next();
  };
}

let entrypointError: Error | null = null;

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
  if (dev && devServer) {
    // Store this globally for devtools
    // @ts-ignore
    globalThis.__viteDevServer = devServer;
  }

  /**
   * We're running in the Node.js runtime without access to `fetch`,
   * which is needed for proxy requests and server-side API requests.
   */
  const webPolyfills =
    !globalThis.fetch || !globalThis.ReadableStream
      ? import('../utilities/web-api-polyfill')
      : undefined;

  return async function (
    request: IncomingMessage,
    response: ServerResponse,
    next: NextFunction
  ) {
    try {
      await webPolyfills;

      const entrypoint = await Promise.resolve(getServerEntrypoint()).catch(
        (error: Error) => {
          // Errors are only thrown the first time we try to load the entry point.
          // After refreshing the browser, this just loads an empty module
          // and doesn't throw anymore. Store this error in the outer scope
          // to keep throwing it on refresh until things are fixed.
          entrypointError = error;
        }
      );

      const handleRequest: RequestHandler = entrypoint?.default ?? entrypoint;

      if (typeof handleRequest !== 'function') {
        if (entrypointError) {
          throw entrypointError;
        } else {
          // This means there is no error when loading the entry point but
          // we are still not getting a function as the default export.
          throw new Error(
            'Something is wrong in your project. Make sure to add "export default renderHydrogen(...)" in your server entry file.'
          );
        }
      }

      entrypointError = null;

      await handleRequest(request, {
        dev,
        cache,
        indexTemplate,
        streamableResponse: response,
      });
    } catch (e: any) {
      if (dev && devServer) devServer.ssrFixStacktrace(e);
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
            ? await indexTemplate(request.originalUrl ?? request.url ?? '')
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
      "You must provide a 'shopify' property in your Hydrogen config file"
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
