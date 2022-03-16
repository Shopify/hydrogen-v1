import type {ServerAnalyticsConnector} from '../../types';

export function ServerAnalyticRoute(
  request: Request,
  serverAnalyticsConnectors?: Array<ServerAnalyticsConnector>
) {
  serverAnalyticsConnectors?.forEach((connector) => {
    connector.request(request);
  });

  return new Response(null, {
    status: 200,
  });
}
