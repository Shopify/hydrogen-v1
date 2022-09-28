import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Router, FileRoutes, ShopifyProvider, useUrl} from '@shopify/hydrogen';
import {Suspense} from 'react';
import {partytownSnippet} from '@builder.io/partytown/integration';
import {Script} from '@shopify/hydrogen/experimental';

let localeRedirects;

/*
  Set the required response headers to enable partytown atomics
  @see: https://partytown.builder.io/atomics
*/
function enablePartytownAtomic(response) {
  response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
}

const handleRequest = renderHydrogen(({response}) => {
  enablePartytownAtomic(response);
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
        {/* load partytown lib/runtime last so that it can pick type="text/partytown" scripts */}
        <Script id="partytown-snippet" load="onIdle">
          {partytownSnippet({
            forward: ['forwardedTestFn'],
            resolveUrl(url, location, type) {
              // Some 3rd party libs/resources like https://www.googletagmanager.com/gtm.js
              // require a reverse proxy to handle CORS via when loaded via Web Worker
              const isScriptReq = type === 'script';
              const isProxyReq = url.href.includes('/reverse-proxy');
              const isCorsReq =
                url.href.includes('cors=true') || url.href.includes('gtm.js');

              if (isScriptReq && isCorsReq && !isProxyReq) {
                const proxyUrl = new URL(location.origin + '/reverse-proxy');
                proxyUrl.searchParams.append('libUrl', url.href);
                return proxyUrl;
              }
              return url;
            },
          })}
        </Script>
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
        5
      )
    );
  }

  return handleRequest(request, options);
}
