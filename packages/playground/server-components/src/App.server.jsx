import renderHydrogen from '@shopify/hydrogen/entry-server';
import {partytownSnippet} from '@builder.io/partytown/integration';
// import {Partytown} from '@builder.io/partytown/react';

import {
  Route,
  Router,
  FileRoutes,
  ShopifyProvider,
  useRequestContext,
} from '@shopify/hydrogen';
import {Script} from '@shopify/hydrogen/experimental';
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

      {/* partytown config */}
      <Script
        load="beforeHydration"
        id="partytown-config"
        suppressHydrationWarning={true}
        dangerouslySetInnerHTML={{
          __html: `
            window.partytown = {
              forward: ['forwardedTestFn'],
              resolveUrl: function(url, location, type) {
                // Some 3rd party libs/resources like https://www.googletagmanager.com/gtm.js
                // require a reverse proxy to handle CORS via when loaded via Web Worker
                const isScriptReq = type === 'script';
                const isProxyReq = url.href.includes('/reverse-proxy');
                const isCorsReq = url.href.includes('cors=true') || url.href.includes('gtm.js')

                if (isScriptReq && isCorsReq && !isProxyReq) {
                  // console.log('🎉 Loading partytown script via CORS reverse proxy:', url.href)
                  const proxyUrl = new URL(location.origin + '/reverse-proxy');
                  proxyUrl.searchParams.append('libUrl', url.href);
                  return proxyUrl;
                }
                return url;
              }
            };
          `,
        }}
      />

      {/*  */}
      {/* <Partytown
        id="partytown-snippet"
        forward={['forwardedTestFn', 'dataLayer.push']}
        debug={true}
        resolveUrl={(url, location, type) => {
          console.log('resolveUrl: url', url);
          // Some 3rd party libs/resources like https://www.googletagmanager.com/gtm.js
          // require a reverse proxy to handle CORS via when loaded via Web Worker
          const isScriptReq = type === 'script';
          const isProxyReq = url.href.includes('/reverse-proxy');
          const isCorsReq = url.href.includes('cors=true');

          if (isScriptReq && isCorsReq && !isProxyReq) {
            console.log(
              '🎉 Loading partytown script via CORS reverse proxy:',
              url.href
            );
            const proxyUrl = new URL(location.origin + '/reverse-proxy');
            url.searchParams.delete('cors');
            proxyUrl.searchParams.append('libUrl', url.href);
            return proxyUrl;
          }
          return url;
        }}
      /> */}

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
      </ShopifyProvider>

      {/* load partytown lib/runtime last so that it can pick type="text/partytown" scripts */}
      <Script id="partytown-snippet" load="onIdle">
        {partytownSnippet()}
      </Script>
    </Suspense>
  );
});

function HasRouteChildren({children}) {
  return children;
}

function HasInternalRoute() {
  return <Route path="/custom4" page={<Custom1 />} />;
}
