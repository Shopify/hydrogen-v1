import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  Route,
  Router,
  FileRoutes,
  ShopifyProvider,
  useRequestContext,
} from '@shopify/hydrogen';
import {Suspense} from 'react';
import Custom1 from './customRoutes/custom1.server';
import Custom2 from './customRoutes/custom2.server';
import LazyRoute from './customRoutes/lazyRoute.server';
import ServerParams from './customRoutes/params.server';

export default renderHydrogen(({request, response}) => {
  if (request.headers.get('user-agent') === 'custom bot') {
    response.doNotStream();
  }

  useRequestContext().test1 = true;
  useRequestContext('scope').test2 = true;

  return (
    <Suspense fallback={'Loading...'}>
      <ShopifyProvider>
        <Router>
          <Route path="/custom1" page={<Custom1 />} />
          <Route path="/custom2/:handle" page={<Custom2 />} />
          <HasRouteChildren>
            <Route path="/custom3" page={<Custom1 />} />
          </HasRouteChildren>
          <HasInternalRoute />
          <Route path="/params/:handle" page={<ServerParams />} />
          <FileRoutes />
          <LazyRoute />
        </Router>
      </ShopifyProvider>
    </Suspense>
  );
});

function HasRouteChildren({children}) {
  return children;
}

function HasInternalRoute() {
  return <Route path="/custom4" page={<Custom1 />} />;
}
