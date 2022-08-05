import type {
  ResolvedHydrogenConfig,
  HydrogenEvents,
  HydrogenEventName,
} from '../../types.js';
import {getLoggerWithContext, log} from '../../utilities/log/index.js';
import type {HydrogenRequest} from '../HydrogenRequest/HydrogenRequest.server.js';

const analyticsDefaultResponse = new Response(null, {
  status: 200,
});

export async function ServerAnalyticsRoute(
  request: HydrogenRequest,
  {hydrogenConfig}: {hydrogenConfig: ResolvedHydrogenConfig}
): Promise<Response> {
  const requestHeader = request.headers;
  const requestUrl = request.url;
  let analyticsPromise: Promise<any> | undefined;
  let bodyPromise: Promise<any> | undefined;

  const connectors = hydrogenConfig.serverAnalyticsConnectors;

  if (requestHeader.get('Content-Length') === '0') {
    analyticsPromise =
      connectors &&
      Promise.resolve(true)
        .then(async () => {
          return Promise.all(
            connectors.map(async (connector) => {
              return await connector.request(requestUrl, requestHeader);
            })
          );
        })
        .catch((error) => {
          log.warn(
            'Failed to resolve server analytics (no content length): ',
            error
          );
        });
  } else if (requestHeader.get('Content-Type') === 'application/json') {
    bodyPromise = Promise.resolve(request.json());

    analyticsPromise =
      connectors &&
      bodyPromise
        .then((data) => {
          return Promise.all(
            connectors.map(async (connector) => {
              return await connector.request(
                requestUrl,
                requestHeader,
                data,
                'json'
              );
            })
          );
        })
        .catch((error) => {
          log.warn('Fail to resolve server analytics (json): ', error);
        });
  } else {
    bodyPromise = Promise.resolve(request.text());

    analyticsPromise =
      connectors &&
      bodyPromise
        .then(async (data) => {
          await connectors.forEach(async (connector) => {
            await connector.request(requestUrl, requestHeader, data, 'text');
          });
          return Promise.all(
            connectors.map(async (connector) => {
              return await connector.request(
                requestUrl,
                requestHeader,
                data,
                'text'
              );
            })
          );
        })
        .catch((error) => {
          log.warn('Failed to resolve server analytics (text): ', error);
        });
  }

  const maybePromise = runEvents(request, bodyPromise);
  if (maybePromise) request.ctx.runtime?.waitUntil(maybePromise);

  await analyticsPromise;

  return analyticsDefaultResponse;
}

function runEvents(request: HydrogenRequest, bodyPromise?: Promise<any>) {
  const url = new URL(request.url);
  const eventName = url.search
    .replace('?', '')
    .toLowerCase()
    .replace(/[_-]([a-z])/g, (_, m1) => m1.toUpperCase()) as HydrogenEventName;

  if (!eventName) return;

  return bodyPromise
    ? bodyPromise.then((payload) => emitEvent(request, eventName, payload))
    : emitEvent(request, eventName);
}

export function emitEvent(
  request: HydrogenRequest,
  eventName: HydrogenEventName,
  payload?: any
) {
  const hc = request.ctx.hydrogenConfig!;
  const events = [] as HydrogenEvents[];
  if (hc.events) events.push(hc.events);
  hc.plugins?.forEach((plugin) => plugin.events && events.push(plugin.events));

  const log = getLoggerWithContext(request);

  for (const eventSet of events) {
    const eventHandler = eventSet[eventName];
    if (eventHandler) {
      const maybePromise = eventHandler({
        headers: request.headers,
        payload,
        log,
      });

      if (maybePromise instanceof Promise) {
        maybePromise.catch((error) =>
          log.warn(
            `Error emitted from an event handler for event "${eventName}"`,
            error
          )
        );

        request.ctx.runtime?.waitUntil(maybePromise);
      }
    }
  }
}
