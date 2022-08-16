import React, {Suspense} from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Router, FileRoutes, ShopifyProvider} from '@shopify/hydrogen';
import {Partytown} from '@builder.io/partytown/react';
import {PageViewEvent} from './components/PageViewEvent.client';
import {GTM} from './components/GTM.server';

/*
  Set the required response headers to enable partytown atomics
  @see: https://partytown.builder.io/atomics
*/
function enablePartytownAtomic(response) {
  response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
}

function App({response}) {
  enablePartytownAtomic(response);

  return (
    <>
      <GTM />

      <Partytown
        // debug={true}  // does not work in atomic mode
        forward={['dataLayer.push']}
        resolveUrl={(url, location, type) => {
          /*
            Some 3rd party libs/resources like https://www.googletagmanager.com/gtm.js
            require a reverse proxy to handle CORS via when loaded via Web Worker
          */
          const isScriptReq = type === 'script';
          const isProxyReq = url.href.includes('/reverse-proxy');

          if (isScriptReq && !isProxyReq) {
            const proxyUrl = new URL(`${location.origin}/reverse-proxy`);
            proxyUrl.searchParams.append('libUrl', url.href);
            return proxyUrl;
          }
          return url;
        }}
      />
      <PageViewEvent />

      <Suspense fallback={null}>
        <ShopifyProvider>
          <Router>
            <FileRoutes />
          </Router>
        </ShopifyProvider>
      </Suspense>
    </>
  );
}

export default renderHydrogen(App);
