import {useServerRequest} from '../ServerRequestProvider';

export function useParams() {
  const request = useServerRequest();
  return request.ctx.routeParams;
}
