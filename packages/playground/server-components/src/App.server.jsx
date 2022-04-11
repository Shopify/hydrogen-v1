import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  Route,
  Router,
  FileRoutes,
  ShopifyProvider,
  setLogger,
} from '@shopify/hydrogen';
import hydrogenConfig from '../hydrogen.config';
import {Suspense} from 'react';
import Custom1 from './customRoutes/custom1.server';
import Custom2 from './customRoutes/custom2.server';
import LazyRoute from './customRoutes/lazyRoute.server';
import ServerParams from './customRoutes/params.server';

setLogger({
  trace() {},
  debug() {},
  warn(context, ...args) {
    console.warn(...args);
  },
  error(context, ...args) {
    console.error(...args);
  },
  fatal(context, ...args) {
    console.error(...args);
  },
  options: () => ({}),
});

function App() {
  return (
    <Suspense fallback={'Loading...'}>
      <ShopifyProvider shopifyConfig={hydrogenConfig.shopify}>
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
}

export default renderHydrogen(App, hydrogenConfig);

function HasRouteChildren({children}) {
  return children;
}

function HasInternalRoute() {
  return <Route path="/custom4" page={<Custom1 />} />;
}
