import {DefaultRoutes} from '@shopify/hydrogen';
import {Suspense} from 'react';
// Whatever powers ESLint here doesn't appear to follow package exports either, maybe? However, these actually do import correctly!
// eslint-disable-next-line node/no-missing-import
import {test as clientTest, MyComponent} from '@shopify/hydrogen-ui/client';
// eslint-disable-next-line node/no-missing-import
import {test as serverTest, HeyComponent} from '@shopify/hydrogen-ui/server';

import shopifyConfig from '../shopify.config';
import DefaultSeo from './components/DefaultSeo.server';
import NotFound from './components/NotFound.server';
import AppClient from './App.client';
import LoadingFallback from './components/LoadingFallback';
import {ShopifyProvider} from '@shopify/hydrogen';

export default function App({log, pages, ...serverState}) {
  console.log(clientTest);
  console.log(serverTest);
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
      <MyComponent />
      <HeyComponent />
    </Suspense>
  );
}
