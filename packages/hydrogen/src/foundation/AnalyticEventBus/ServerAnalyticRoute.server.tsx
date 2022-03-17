import type {ServerAnalyticsConnector} from '../../types';
import {log} from '../../utilities/log';

export function ServerAnalyticRoute(
  request: Request,
  serverAnalyticsConnectors?: Array<ServerAnalyticsConnector>
) {
  Promise.resolve(request.json())
    .then((data) => {
      serverAnalyticsConnectors?.forEach((connector) => {
        connector.request(request, data);
      });
    })
    .catch((error) => {
      log.warn('Fail to resolve server analytics: ', error);
    });

  return new Response(null, {
    status: 200,
  });
}
