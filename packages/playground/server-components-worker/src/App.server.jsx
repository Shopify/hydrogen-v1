import {DefaultRoutes} from '@shopify/hydrogen';
import {ShopifyProvider} from '@shopify/hydrogen';
import {Suspense} from 'react';
import shopifyConfig from '../shopify.config';

export default function App({...serverState}) {
  return (
    <Suspense fallback={'Loading...'}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <DefaultRoutes
          pages={serverState.pages}
          serverState={serverState}
          fallback="Not Found"
        />
      </ShopifyProvider>
    </Suspense>
  );
}
