import renderHydrogen from '@shopify/hydrogen/entry-server';
import {partytownSnippet} from '@builder.io/partytown/integration';
// import {Script} from '@shopify/hydrogen/experimental';
import {
  Route,
  Router,
  FileRoutes,
  ShopifyProvider,
  useRequestContext,
  Script,
} from '@shopify/hydrogen';
import {Suspense} from 'react';
import Custom1 from './customRoutes/custom1.server';
import Custom2 from './customRoutes/custom2.server';
import LazyRoute from './customRoutes/lazyRoute.server';
import ServerParams from './customRoutes/params.server';

/*
  Set the required response headers to enable partytown atomics
  @see: https://partytown.builder.io/atomics
*/
function enablePartytownAtomic(response) {
  response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
}

export default renderHydrogen(({request, response}) => {
  if (request.headers.get('user-agent') === 'custom bot') {
    response.doNotStream();
  }

  enablePartytownAtomic(response);

  useRequestContext().test1 = true;
  useRequestContext('scope').test2 = true;

  return (
    <Suspense fallback={'Loading...'}>
      {/* Add to App.server.jsx */}

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

function HasRouteChildren({children}) {
  return children;
}

function HasInternalRoute() {
  return <Route path="/custom4" page={<Custom1 />} />;
}
