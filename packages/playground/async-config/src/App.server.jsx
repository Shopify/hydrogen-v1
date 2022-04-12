import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  Router,
  FileRoutes,
  ShopifyProvider,
  setLogger,
  useUrl,
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

export default renderHydrogen(({customConfig, response}) => {
  const url = useUrl();

  for (const [key, value] of Object.entries(customConfig.redirects)) {
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
