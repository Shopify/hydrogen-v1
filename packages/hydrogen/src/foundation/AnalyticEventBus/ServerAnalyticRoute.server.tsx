import {publish} from './ServerAnalytics.server';

export function ServerAnalyticRoute(request: Request) {
  Promise.resolve(request.json()).then((data) => {
    console.log(data);
    publish(data.eventname, data.payload);
  });

  return new Response(null, {
    status: 200,
  });
}
