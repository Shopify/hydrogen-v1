import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  Router,
  FileRoutes,
  ShopifyProvider,
  setLogger,
} from '@shopify/hydrogen';
import shopifyConfig from '../shopify.config';
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

function App({routes, ...serverProps}) {
  return (
    <Suspense fallback={'Loading...'}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <Router fallback="Not found" serverProps={serverProps}>
          <FileRoutes routes={routes} />
        </Router>
      </ShopifyProvider>
    </Suspense>
  );
}

const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {routes});
