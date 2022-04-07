import type {ServerAnalyticsConnector} from '../../types';
import {log} from '../../utilities/log';

export function ServerAnalyticsRoute(
  request: Request,
  serverAnalyticsConnectors?: Array<ServerAnalyticsConnector>
) {
  if (request.headers.get('Content-Length') === '0') {
    serverAnalyticsConnectors?.forEach((connector) => {
      connector.request(request);
    });
  } else if (request.headers.get('Content-Type') === 'application/json') {
    Promise.resolve(request.json())
      .then((data) => {
        serverAnalyticsConnectors?.forEach((connector) => {
          connector.request(request, data, 'json');
        });
      })
      .catch((error) => {
        log.warn('Fail to resolve server analytics: ', error);
      });
  } else {
    Promise.resolve(request.text())
      .then((data) => {
        serverAnalyticsConnectors?.forEach((connector) => {
          connector.request(request, data, 'text');
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
