import {EntryServerHandler} from './types';
import {ServerResponse} from 'http';
import type {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import {getCacheControlHeader} from './framework/cache';
import {setContext, setCache, RuntimeContext} from './framework/runtime';
import {setConfig} from './framework/config';
import {log, logServerResponse} from './utilities/log';

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
  streamableResponse: ServerResponse;
  dev?: boolean;
  context?: RuntimeContext;
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
  const {render, hydrate, stream}: EntryServerHandler =
    entrypoint.default || entrypoint;

  // @ts-ignore
  if (dev && !(render && hydrate && stream)) {
    throw new Error(
      `entry-server.jsx could not be loaded. This likely occurred because of a Vite compilation error.\n` +
        `Please check your server logs for more information.`
    );
  }

  const userAgent = request.headers.get('user-agent');
  const isStreamable = streamableResponse && !isBotUA(url, userAgent);

  const logger = log(request);

  /**
   * Stream back real-user responses, but for bots/etc,
   * use `render` instead. This is because we need to inject <head>
   * things for SEO reasons.
   */
  if (isStreamable) {
    if (isReactHydrationRequest) {
      hydrate(url, {
        context: {},
        request,
        response: streamableResponse,
        dev,
        log: logger,
      });
    } else {
      stream(url, {
        context: {},
        request,
        response: streamableResponse,
        template,
        dev,
        log: logger,
      });
    }
    return;
  }

  const {body, bodyAttributes, htmlAttributes, componentResponse, ...head} =
    await render(url, {
      request,
      context: {},
      isReactHydrationRequest,
      dev,
      log: logger,
    });

  const headers = componentResponse.headers;

  /**
   * TODO: Also add `Vary` headers for `accept-language` and any other keys
   * we want to shard our full-page cache for all Hydrogen storefronts.
   */
  headers.set(
    getCacheControlHeader({dev}),
    componentResponse.cacheControlHeader
  );

  if (componentResponse.customBody) {
    const {status, customStatus} = componentResponse;

    return new Response(await componentResponse.customBody, {
      status: customStatus?.code ?? status ?? 200,
      statusText: customStatus?.text,
      headers,
    });
  }

  let response;

  if (isReactHydrationRequest) {
    response = new Response(body, {
      status: componentResponse.status ?? 200,
      headers,
    });
  } else {
    const html = template
      .replace(
        `<div id="root"></div>`,
        `<div id="root" data-server-rendered="true">${body}</div>`
      )
      .replace(/<head>(.*?)<\/head>/s, generateHeadTag(head))
      .replace('<body', bodyAttributes ? `<body ${bodyAttributes}` : '$&')
      .replace('<html', htmlAttributes ? `<html ${htmlAttributes}` : '$&');

    headers.append('content-type', 'text/html');

    const {status, customStatus} = componentResponse;

    response = new Response(html, {
      status: customStatus?.code ?? status ?? 200,
      statusText: customStatus?.text,
      headers,
    });
  }

  logServerResponse('ssr', log, request, response.status);

  return response;
}

/**
 * Generate the contents of the `head` tag, and update the existing `<title>` tag
 * if one exists, and if a title is passed.
 */
function generateHeadTag(head: Record<string, string>) {
  const headProps = ['base', 'meta', 'style', 'noscript', 'script', 'link'];
  const {title, ...rest} = head;

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
