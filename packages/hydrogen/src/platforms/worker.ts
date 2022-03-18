import type {RequestHandler} from '../entry-server';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import entrypoint from '__SERVER_ENTRY__';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import indexTemplate from '__INDEX_TEMPLATE__?raw';

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

export default {
  async fetch(
    request: Request,
    env: unknown,
    context: {waitUntil: (promise: Promise<any>) => void}
  ) {
    if (!globalThis.Oxygen) {
      globalThis.Oxygen = {env};
    }

    try {
      return (await handleRequest(request, {
        indexTemplate,
        cache: (caches as unknown as CacheStorage).default,
        context,
      })) as Response;
    } catch (error: any) {
      return new Response(error.message || error.toString(), {status: 500});
    }
  },
};
