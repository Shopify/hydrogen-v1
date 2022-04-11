import {useServerRequest} from '../ServerRequestProvider';

export function useServerAnalytics(data?: any): any {
  const request = useServerRequest();
  if (data)
    request.ctx.analyticsData = Object.assign(
      {},
      request.ctx.analyticsData,
      data
    );
  return request.ctx.analyticsData;
}
