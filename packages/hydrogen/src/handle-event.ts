import type {HandleRequest} from './entry-server';

interface HydrogenFetchEvent {
  /**
   * Hydrogen only cares about a single property, since we pass `request` as a separate option.
   */
  waitUntil?: (callback: Promise<void>) => void;
}

export default async function handleEvent(
  event: HydrogenFetchEvent,
  options: Parameters<HandleRequest>[1] & {
    request: Parameters<HandleRequest>[0];
  }
) {
  const handleRequest: HandleRequest =
    options.entrypoint.default || options.entrypoint;

  // @ts-ignore
  if (options.dev && !handleRequest) {
    throw new Error(
      `entry-server.jsx could not be loaded. This likely occurred because of a Vite compilation error.\n` +
        `Please check your server logs for more information.`
    );
  }

  return handleRequest(options.request, {...options, event});
}
