import {ShopifyServerProvider, DefaultRoutes} from '@shopify/hydrogen';
import shopifyConfig from '../shopify.config';
import {Suspense} from 'react';

export default function App({...serverState}) {
  const pages = import.meta.globEager('./pages/**/*.server.[jt]sx');

  return (
    <Suspense fallback={'Loading...'}>
      <ShopifyServerProvider shopifyConfig={shopifyConfig} {...serverState}>
        <DefaultRoutes
          pages={pages}
          serverState={serverState}
          fallback="Not Found"
        />
      </ShopifyServerProvider>
    </Suspense>
  );
}
