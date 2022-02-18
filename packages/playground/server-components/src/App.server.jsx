import renderHydrogen from '@shopify/hydrogen/entry-server';
import {DefaultRoutes, ShopifyProvider, setLogger} from '@shopify/hydrogen';
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
        <DefaultRoutes
          routes={serverState.routes}
          serverState={serverState}
          fallback="Not Found"
        />
      </ShopifyProvider>
    </Suspense>
  );
}

const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {routes});
