import {publish} from './ServerAnalytics.server';

export function ServerAnalyticRoute(
  request: Request,
  serverAnalyticsConnector?: Array<(request: Request) => void>
) {
  Promise.resolve(request.json())
    .then((data) => {
      if (data.eventname) {
        publish(data.eventname, data.payload);
      }
    })
    .catch((error) => {
      console.log('Fail to resolve server analytics: ', error);
    });

  serverAnalyticsConnector?.forEach((callback) => {
    callback(request);
  });

  return new Response(null, {
    status: 200,
  });
}
