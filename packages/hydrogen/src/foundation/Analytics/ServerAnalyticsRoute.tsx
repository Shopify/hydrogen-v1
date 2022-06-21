import type {ResolvedHydrogenConfig} from '../../types';
import {log} from '../../utilities/log';

export async function ServerAnalyticsRoute(
  request: Request,
  {hydrogenConfig}: {hydrogenConfig: ResolvedHydrogenConfig}
): Promise<Response> {
  const requestHeader = request.headers;
  const requestUrl = request.url;
  const serverAnalyticsConnectors = hydrogenConfig.serverAnalyticsConnectors;
  let analyticsPromise: Promise<any>;

  if (requestHeader.get('Content-Length') === '0') {
    analyticsPromise = Promise.resolve(true)
      .then(async () => {
        await serverAnalyticsConnectors?.forEach(async (connector) => {
          await connector.request(requestUrl, request.headers);
        });
      })
      .catch((error) => {
        log.warn(
          'Fail to resolve server analytics (no content length): ',
          error
        );
      });
  } else if (requestHeader.get('Content-Type') === 'application/json') {
    analyticsPromise = Promise.resolve(request.json())
      .then((data) => {
        return Promise.all(
          serverAnalyticsConnectors?.forEach(async (connector) => {
            return await connector.request(
              requestUrl,
              requestHeader,
              data,
              'json'
            );
          }) || []
        );
      })
      .catch((error) => {
        log.warn('Fail to resolve server analytics (json): ', error);
      });
  } else {
    analyticsPromise = Promise.resolve(request.text())
      .then(async (data) => {
        await serverAnalyticsConnectors?.forEach(async (connector) => {
          await connector.request(requestUrl, requestHeader, data, 'text');
        });
      })
      .catch((error) => {
        log.warn('Fail to resolve server analytics (text): ', error);
      });
  }

  return Promise.resolve(true)
    .then(() => {
      // @ts-ignore
      request.ctx.runtime?.waitUntil(analyticsPromise);
    })
    .then(() => {
      return new Response(null, {
        status: 200,
      });
    });
}
