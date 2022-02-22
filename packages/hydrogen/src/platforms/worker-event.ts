import type {RequestHandler} from '../entry-server';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import entrypoint from '__SERVER_ENTRY__';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import indexTemplate from '__INDEX_TEMPLATE__?raw';

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

declare global {
  // eslint-disable-next-line no-var
  var globalThis: {
    Oxygen: {env: any};
    [key: string]: any;
  };
}

if (!globalThis.Oxygen) {
  globalThis.Oxygen = {env: globalThis};
}

async function handleEvent(event: FetchEvent) {
  try {
    return (await handleRequest(event.request, {
      indexTemplate,
      cache: (caches as unknown as CacheStorage).default,
      context: event,
    })) as Response;
  } catch (error: any) {
    return new Response(error.message || error.toString(), {status: 500});
  }
}

// @ts-ignore
addEventListener('fetch', (event: FetchEvent) =>
  event.respondWith(handleEvent(event))
);
