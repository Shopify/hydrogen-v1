import type {ResolvedHydrogenConfig} from '../../types.js';
import {log} from '../../utilities/log/index.js';

const analyticsDefaultResponse = new Response(null, {
  status: 200,
});

export async function ServerAnalyticsRoute(
  request: Request,
  {hydrogenConfig}: {hydrogenConfig: ResolvedHydrogenConfig}
): Promise<Response> {
  const serverAnalyticsConnectors = hydrogenConfig.serverAnalyticsConnectors;

  if (!serverAnalyticsConnectors) {
    return analyticsDefaultResponse;
  }

  const requestHeader = request.headers;
  const requestUrl = request.url;
  let analyticsPromise: Promise<any>;

  if (requestHeader.get('Content-Length') === '0') {
    analyticsPromise = Promise.resolve(true)
      .then(async () => {
        return Promise.all(
          serverAnalyticsConnectors.map(async (connector) => {
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
    analyticsPromise = Promise.resolve(request.json())
      .then((data) => {
        return Promise.all(
          serverAnalyticsConnectors.map(async (connector) => {
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
    analyticsPromise = Promise.resolve(request.text())
      .then(async (data) => {
        await serverAnalyticsConnectors.forEach(async (connector) => {
          await connector.request(requestUrl, requestHeader, data, 'text');
        });
        return Promise.all(
          serverAnalyticsConnectors.map(async (connector) => {
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

  await analyticsPromise;
  return analyticsDefaultResponse;
}
