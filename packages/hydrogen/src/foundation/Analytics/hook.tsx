import {useServerRequest} from '../ServerRequestProvider/index.js';
import {mergeDeep} from './utils.js';

export function useServerAnalytics(data?: any): any {
  const request = useServerRequest();

  if (data) {
    request.ctx.analyticsData = mergeDeep(request.ctx.analyticsData, data);
  }

  return request.ctx.analyticsData;
}
