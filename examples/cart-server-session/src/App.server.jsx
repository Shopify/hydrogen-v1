import {
  ShopifyProvider,
  Router,
  FileRoutes,
  CacheNone,
} from '@shopify/hydrogen';

import React from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Suspense} from 'react';
import {Header} from '~/components/Header.server';
import {Sidebar} from '~/components/Sidebar.server';
import {AsyncGetCartLines} from '~/components/AsyncGetCartLines.server';

function App({request, response}) {
  response.cache(CacheNone());
  const isFavIconRequest = request.normalizedUrl.includes('favicon');

  if (isFavIconRequest) {
    return null;
  }

  const url = new URL(request.normalizedUrl);
  const toggleSidebar = url.searchParams.get('toggleSidebar') || false;

  return (
    <ShopifyProvider>
      <Header toggleSidebar={toggleSidebar}>
        <Sidebar>
          <Suspense fallback="Loading cart lines from API...">
            <AsyncGetCartLines />
          </Suspense>
        </Sidebar>
      </Header>
      <Router>
        <FileRoutes />
      </Router>
    </ShopifyProvider>
  );
}

export default renderHydrogen(App);
