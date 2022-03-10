import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  Route,
  Router,
  FileRoutes,
  ShopifyProvider,
  setLogger,
} from '@shopify/hydrogen';
import shopifyConfig from '../shopify.config';
import {Suspense} from 'react';
import Custom1 from './customRoutes/custom1.server';
import Custom2 from './customRoutes/custom2.server';

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

function App({routes, ...serverProps}) {
  return (
    <Suspense fallback={'Loading...'}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <Router serverProps={serverProps}>
          <Route path="/custom1" page={<Custom1 />} />
          <Route path="/custom2/:handle" page={<Custom2 />} />
          <HasRouteChildren>
            <Route path="/custom3" page={<Custom1 />} />
          </HasRouteChildren>
          <HasInternalRoute />
          <FileRoutes routes={routes} />
        </Router>
      </ShopifyProvider>
    </Suspense>
  );
}

const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {shopifyConfig, routes});

function HasRouteChildren({children}) {
  return children;
}

function HasInternalRoute() {
  return <Route path="/custom4" page={<Custom1 />} />;
}
