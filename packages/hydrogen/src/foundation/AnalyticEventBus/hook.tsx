import {useServerRequest} from '../ServerRequestProvider';

export function useServerDatalayer(data?: any): any {
  const request = useServerRequest();
  if (data)
    request.ctx.analyticData = Object.assign(
      {},
      request.ctx.analyticData,
      data
    );
  return request.ctx.analyticData;
}
