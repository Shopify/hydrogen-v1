import {EntryServerHandler} from './types';
import {ServerResponse} from 'http';
import type {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import {setContext, setCache, RuntimeContext} from './framework/runtime';
import {setConfig} from './framework/config';
import {renderApiRoute} from './utilities/apiRoutes';
import {makeShopifyContext} from './foundation/useShop/use-shop';

interface HydrogenFetchEvent {
  /**
   * Hydrogen only cares about a single property, since we pass `request` as a separate option.
   */
  waitUntil?: (callback: Promise<void>) => void;
}

export interface HandleEventOptions {
  request: ServerComponentRequest;
  entrypoint: any;
  indexTemplate: string | ((url: string) => Promise<string>);
  assetHandler?: (event: HydrogenFetchEvent, url: URL) => Promise<Response>;
  cache?: Cache;
  streamableResponse?: ServerResponse;
  dev?: boolean;
  context?: RuntimeContext;
  nonce?: string;
}

export default async function handleEvent(
  event: HydrogenFetchEvent,
  {
    request,
    entrypoint,
    indexTemplate,
    assetHandler,
    streamableResponse,
    dev,
    cache,
    context,
    nonce,
  }: HandleEventOptions
) {
  const url = new URL(request.url);

  /**
   * Inject the cache & context into the module loader so we can pull it out for subrequests.
   */
  setCache(cache);
  setContext(context);
  setConfig({dev});

  const isReactHydrationRequest = url.pathname === '/react';

  const template =
    typeof indexTemplate === 'function'
      ? await indexTemplate(url.toString())
      : indexTemplate;

  /**
   * If this is a request for an asset, and an asset handler is present, call it.
   */
  if (
    /\.(png|jpe?g|gif|css|js|svg|ico|map)$/i.test(url.pathname) &&
    assetHandler
  ) {
    return assetHandler(event, url);
  }
  const {
    render,
    hydrate,
    stream,
    getApiRoute,
    log,
    shopifyConfig,
  }: EntryServerHandler = entrypoint.default || entrypoint;

  // @ts-ignore
  if (dev && !(render && hydrate && stream && getApiRoute)) {
    throw new Error(
      `entry-server.jsx could not be loaded. This likely occurred because of a Vite compilation error.\n` +
        `Please check your server logs for more information.`
    );
  }

  if (typeof shopifyConfig === 'function') {
    request.ctx.shopifyConfig = makeShopifyContext(shopifyConfig(url));
  } else {
    request.ctx.shopifyConfig = makeShopifyContext(shopifyConfig);
  }

  if (!isReactHydrationRequest) {
    const apiRoute = getApiRoute(url);

    // The API Route might have a default export, making it also a server component
    // If it does, only render the API route if the request method is GET
    if (
      apiRoute &&
      (!apiRoute.hasServerComponent || request.method !== 'GET')
    ) {
      return renderApiRoute(request, apiRoute, log);
    }
  }

  const isStreamable =
    !isBotUA(url, request.headers.get('user-agent')) &&
    (!!streamableResponse || supportsReadableStream());

  if (isReactHydrationRequest) {
    return hydrate(url, {
      request,
      response: streamableResponse,
      isStreamable,
      dev,
    });
  }

  /**
   * Stream back real-user responses, but for bots/etc,
   * use `render` instead. This is because we need to inject <head>
   * things for SEO reasons.
   */
  if (isStreamable) {
    return stream(url, {
      request,
      response: streamableResponse,
      template,
      nonce,
      dev,
    });
  }

  return render(url, {
    request,
    template,
    nonce,
    dev,
  });
}

/**
 * Determines if the request is from a bot, using the URL and User Agent
 */
function isBotUA(url: URL, userAgent: string | null): boolean {
  return (
    url.searchParams.has('_bot') || (!!userAgent && botUARegex.test(userAgent))
  );
}

/**
 * An alphabetized list of User Agents of known bots, combined from lists found at:
 * https://github.com/vercel/next.js/blob/d87dc2b5a0b3fdbc0f6806a47be72bad59564bd0/packages/next/server/utils.ts#L18-L22
 * https://github.com/GoogleChrome/rendertron/blob/6f681688737846b28754fbfdf5db173846a826df/middleware/src/middleware.ts#L24-L41
 */
const botUserAgents = [
  'AdsBot-Google',
  'applebot',
  'Baiduspider',
  'baiduspider',
  'bingbot',
  'Bingbot',
  'BingPreview',
  'bitlybot',
  'Discordbot',
  'DuckDuckBot',
  'Embedly',
  'facebookcatalog',
  'facebookexternalhit',
  'Google-PageRenderer',
  'Googlebot',
  'googleweblight',
  'ia_archive',
  'LinkedInBot',
  'Mediapartners-Google',
  'outbrain',
  'pinterest',
  'quora link preview',
  'redditbot',
  'rogerbot',
  'showyoubot',
  'SkypeUriPreview',
  'Slackbot',
  'Slurp',
  'sogou',
  'Storebot-Google',
  'TelegramBot',
  'tumblr',
  'Twitterbot',
  'vkShare',
  'W3C_Validator',
  'WhatsApp',
  'yandex',
];

/**
 * Creates a regex based on the botUserAgents array
 */
const botUARegex = new RegExp(botUserAgents.join('|'), 'i');

function supportsReadableStream() {
  try {
    new ReadableStream();
    return true;
  } catch (_) {
    return false;
  }
}
