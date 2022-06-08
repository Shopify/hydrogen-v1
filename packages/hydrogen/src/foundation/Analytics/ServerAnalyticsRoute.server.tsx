import type {ServerAnalyticsConnector} from '../../types';
import {log} from '../../utilities/log';

export function ServerAnalyticsRoute(
  request: Request,
  serverAnalyticsConnectors?: Array<ServerAnalyticsConnector>
) {
  const requestHeader = request.headers;
  const requestUrl = request.url;

  if (requestHeader.get('Content-Length') === '0') {
    serverAnalyticsConnectors?.forEach((connector) => {
      connector.request(requestUrl, request.headers);
    });
  } else if (requestHeader.get('Content-Type') === 'application/json') {
    Promise.resolve(request.json())
      .then((data) => {
        serverAnalyticsConnectors?.forEach((connector) => {
          connector.request(requestUrl, requestHeader, data, 'json');
        });
      })
      .catch((error) => {
        log.warn('Fail to resolve server analytics: ', error);
      });
  } else {
    Promise.resolve(request.text())
      .then((data) => {
        serverAnalyticsConnectors?.forEach((connector) => {
          connector.request(requestUrl, requestHeader, data, 'text');
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
