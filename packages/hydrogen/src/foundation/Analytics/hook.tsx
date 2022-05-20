import merge from 'lodash-es/merge';
import {useServerRequest} from '../ServerRequestProvider';

export function useServerAnalytics(data?: any): any {
  const request = useServerRequest();

  if (data) {
    request.ctx.analyticsData = merge({}, request.ctx.analyticsData, data);
  }

  return request.ctx.analyticsData;
}
