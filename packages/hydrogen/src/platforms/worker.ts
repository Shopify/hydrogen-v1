import type {RequestHandler} from '../types.js';
// @ts-expect-error
import entrypoint from '__SERVER_ENTRY__';
import indexTemplate from '__INDEX_TEMPLATE__?raw';

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
        cache: await caches.open('oxygen'),
        context,
        buyerIpHeader: 'oxygen-buyer-ip',
      })) as Response;
    } catch (error: any) {
      return new Response(error.message || error.toString(), {status: 500});
    }
  },
};
