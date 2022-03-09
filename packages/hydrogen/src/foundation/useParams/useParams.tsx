import {useEnvContext} from '../ssr-interop';
import {RouteParamsContext} from './RouteParamsProvider.client';

/**
 *  The `useParams()` hook is available in both Server and Client components for retrieving the params of the active route
 */
export function useParams() {
  const router = useEnvContext((req) => req.ctx.router, RouteParamsContext);
  return router.routeParams;
}
