import {HydrogenRequest} from '../../../dist/esnext';
import type {ResolvedHydrogenConfig} from '../../types';
import {log} from '../../utilities/log';

export async function ServerAnalyticsRoute(
  request: HydrogenRequest,
  {hydrogenConfig}: {hydrogenConfig: ResolvedHydrogenConfig}
) {
  const requestHeader = request.headers;
  const requestUrl = request.url;
  const serverAnalyticsConnectors = hydrogenConfig.serverAnalyticsConnectors;
  const waitUntil = request.ctx.runtime?.waitUntil;

  if (requestHeader.get('Content-Length') === '0') {
    serverAnalyticsConnectors?.forEach((connector) => {
      connector.request(requestUrl, request.headers, waitUntil);
    });
  } else if (requestHeader.get('Content-Type') === 'application/json') {
    Promise.resolve(request.json())
      .then((data) => {
        serverAnalyticsConnectors?.forEach((connector) => {
          connector.request(requestUrl, requestHeader, waitUntil, data, 'json');
        });
      })
      .catch((error) => {
        log.warn('Fail to resolve server analytics: ', error);
      });
  } else {
    Promise.resolve(request.text())
      .then((data) => {
        serverAnalyticsConnectors?.forEach((connector) => {
          connector.request(requestUrl, requestHeader, waitUntil, data, 'text');
        });
      })
      .catch((error) => {
        log.warn('Fail to resolve server analytics: ', error);
      });
  }

  return new Response(null, {
    status: 200,
  });
}
