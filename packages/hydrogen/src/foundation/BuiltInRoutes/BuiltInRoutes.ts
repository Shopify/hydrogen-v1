import {EVENT_PATHNAME, EVENT_PATHNAME_REGEX} from '../../constants';
import {ResourceGetter} from '../../utilities/apiRoutes';
import {ServerAnalyticsRoute} from '../Analytics/ServerAnalyticsRoute';
import {HealthCheck} from './healthCheck';

type BuiltInRoute = {
  pathname?: string;
  regex?: RegExp;
  resource: ResourceGetter;
};

const builtInRoutes: Array<BuiltInRoute> = [
  {
    pathname: EVENT_PATHNAME,
    regex: EVENT_PATHNAME_REGEX,
    resource: ServerAnalyticsRoute,
  },
  {
    pathname: '/__health',
    resource: HealthCheck,
  },
];

export function getBuiltInRoute(url: URL): ResourceGetter | null {
  for (const route of builtInRoutes) {
    if (
      url.pathname === route.pathname ||
      (route.regex && route.regex.test(url.pathname))
    ) {
      return route.resource;
    }
  }
  return null;
}
