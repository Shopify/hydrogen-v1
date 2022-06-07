import {useServerRequest} from '../ServerRequestProvider';
import {mergeDeep} from './utils';

export function useServerAnalytics(data?: any): any {
  const request = useServerRequest();

  if (data) {
    request.ctx.analyticsData = mergeDeep(request.ctx.analyticsData, data);
  }

  return request.ctx.analyticsData;
}
