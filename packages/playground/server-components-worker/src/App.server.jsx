import {ShopifyServerProvider, DefaultRoutes} from '@shopify/hydrogen';
import {Switch} from 'react-router-dom';
import shopifyConfig from '../shopify.config';
import {Suspense} from 'react';

export default function App({...serverState}) {
  const pages = import.meta.globEager('./pages/**/*.server.[jt]sx');

  return (
    <ShopifyServerProvider shopifyConfig={shopifyConfig} {...serverState}>
      <Suspense fallback={'Loading...'}>
        <DefaultRoutes
          pages={pages}
          serverState={serverState}
          fallback="Not Found"
        />
      </Suspense>
    </ShopifyServerProvider>
  );
}
