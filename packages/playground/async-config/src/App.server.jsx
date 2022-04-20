import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  Router,
  FileRoutes,
  ShopifyProvider,
  setLogger,
  useUrl,
  usePluginContext,
} from '@shopify/hydrogen';
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

export default renderHydrogen(({response}) => {
  const url = useUrl();
  const {redirects} = usePluginContext('my-redirects');

  for (const [key, value] of Object.entries(redirects)) {
    if (url.pathname === key) {
      return response.redirect(value);
    }
  }

  return (
    <Suspense fallback={'Loading...'}>
      <ShopifyProvider>
        <Router>
          <FileRoutes />
        </Router>
      </ShopifyProvider>
    </Suspense>
  );
});
