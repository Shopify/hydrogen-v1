import type {RequestHandler} from '../entry-server';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import entrypoint from '__SERVER_ENTRY__';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import indexTemplate from '__INDEX_TEMPLATE__?raw';
// This is in peerDependencies, so not extraneous
// eslint-disable-next-line node/no-extraneous-import
import {getAssetFromKV} from '@cloudflare/kv-asset-handler';

interface FetchEvent extends Event {
  readonly request: Request;
  respondWith(promise: Response | Promise<Response>): void;
  passThroughOnException(): void;
  waitUntil(promise: Promise<any>): void;
}

interface CacheStorage {
  open(cacheName: string): Promise<Cache>;
  readonly default: Cache;
}

const handleRequest = entrypoint as RequestHandler;

// @ts-ignore
globalThis.Oxygen = {env: globalThis};

function isAsset(url: URL) {
  return /\.(png|jpe?g|gif|css|js|svg|ico|map)$/i.test(url.pathname);
}

async function handleAsset(url: URL, event: FetchEvent) {
  const response = await getAssetFromKV(event, {});

  if (response.status < 400) {
    const filename = url.pathname.split('/').pop() || '';

    const maxAge =
      filename.split('.').length > 2
        ? 31536000 // hashed asset, will never be updated
        : 86400; // favicon and other public assets

    response.headers.append('cache-control', `public, max-age=${maxAge}`);
  }

  return response;
}

async function handleEvent(event: FetchEvent) {
  try {
    const url = new URL(event.request.url);
    const responsePromise = isAsset(url)
      ? handleAsset(url, event)
      : handleRequest(event.request, {
          indexTemplate,
          cache: (caches as unknown as CacheStorage).default,
          context: event,
        });

    return (await responsePromise) as Response;
  } catch (error: any) {
    return new Response(error.message || error.toString(), {status: 500});
  }
}

// @ts-ignore
addEventListener('fetch', (event: FetchEvent) =>
  event.respondWith(handleEvent(event))
);
