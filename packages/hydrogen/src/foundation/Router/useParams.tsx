import {useEnvContext} from '../ssr-interop';
import {RouteParamsContext} from './RouteParamsProvider.client';

export function useParams() {
  const router = useEnvContext((req) => req.ctx.router, RouteParamsContext);
  return router.routeParams;
}
