import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  Router,
  DefaultRoutes,
  ShopifyProvider,
  setLogger,
  Route,
} from '@shopify/hydrogen';
import shopifyConfig from '..//shopify.config';
import {Suspense} from 'react';

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

function App({...serverState}) {
  return (
    <Suspense fallback={'Loading...'}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <Router fallback="Not Found" serverState={serverState}>
          <DefaultRoutes routes={serverState.routes} />
        </Router>
      </ShopifyProvider>
    </Suspense>
  );
}

const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {routes});
