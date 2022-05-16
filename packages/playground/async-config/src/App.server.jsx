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

let localeRedirects;

const handleRequest = renderHydrogen(({response}) => {
  const url = useUrl();
  const locale = url.pathname.startsWith('/es') ? 'es' : 'en';
  const redirects = localeRedirects[locale];

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

export default async function (request, options) {
  if (!localeRedirects) {
    localeRedirects = await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            es: {'/es/products': '/es/productos'},
            en: {'/en/productos': '/en/products'},
          }),
        20
      )
    );
  }

  return handleRequest(request, options);
}
