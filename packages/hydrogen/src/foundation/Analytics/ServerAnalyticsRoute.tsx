import type {ResolvedHydrogenConfig} from '../../types';
import {log} from '../../utilities/log';
import {HydrogenRequest} from '../HydrogenRequest/HydrogenRequest.server';

export async function ServerAnalyticsRoute(
  request: HydrogenRequest,
  {hydrogenConfig}: {hydrogenConfig: ResolvedHydrogenConfig}
) {
  const requestHeader = request.headers;
  const requestUrl = request.url;
  const serverAnalyticsConnectors = hydrogenConfig.serverAnalyticsConnectors;
  let analyticsPromise;

  if (requestHeader.get('Content-Length') === '0') {
    analyticsPromise = Promise.resolve(true)
      .then(() => {
        serverAnalyticsConnectors?.forEach(async (connector) => {
          await connector.request(requestUrl, request.headers);
        });
      })
      .catch((error) => {
        log.warn('Fail to resolve server analytics: ', error);
      });
  } else if (requestHeader.get('Content-Type') === 'application/json') {
    analyticsPromise = Promise.resolve(request.json())
      .then((data) => {
        serverAnalyticsConnectors?.forEach(async (connector) => {
          await connector.request(requestUrl, requestHeader, data, 'json');
        });
      })
      .catch((error) => {
        log.warn('Fail to resolve server analytics: ', error);
      });
  } else {
    analyticsPromise = Promise.resolve(request.text())
      .then((data) => {
        serverAnalyticsConnectors?.forEach(async (connector) => {
          await connector.request(requestUrl, requestHeader, data, 'text');
        });
      })
      .catch((error) => {
        log.warn('Fail to resolve server analytics: ', error);
      });
  }
  request.ctx.runtime?.waitUntil(analyticsPromise);

  return new Response(null, {
    status: 200,
  });
}
