import {DefaultRoutes} from '@shopify/hydrogen';
import {Suspense} from 'react';

import shopifyConfig from '../shopify.config';
import DefaultSeo from './components/DefaultSeo.server';
import NotFound from './components/NotFound.server';
import AppClient from './App.client';
import LoadingFallback from './components/LoadingFallback';
import {ShopifyProvider} from '@shopify/hydrogen';

export default function App({log, pages, ...serverState}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <AppClient>
          <DefaultSeo />
          <DefaultRoutes
            pages={pages}
            serverState={serverState}
            log={log}
            fallback={<NotFound />}
          />
        </AppClient>
      </ShopifyProvider>
    </Suspense>
  );
}
