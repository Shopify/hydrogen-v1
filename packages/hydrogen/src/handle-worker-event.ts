import handleEvent from './handle-event';

interface FetchEvent {
  request: Request;
  waitUntil?: (callback: Promise<void>) => void;
}

/**
 * This is a wrapper around `handleEvent` that upgrades Request to ServerComponentRequest,
 * so the rest of the application downstream has access to things like `request.cookies`, etc.
 */
export default async function handleWorkerEvent(
  event: FetchEvent,
  options: Parameters<typeof handleEvent>[1]
) {
  /**
   * Note: We need to pass `request` as a separate option since Cloudflare (and other Worker
   * runtimes, presumably) does not like when `event` is mutated.
   */
  return handleEvent(event, {...options, request: event.request});
}
