import {ShopifyServerProvider, DefaultRoutes} from '@shopify/hydrogen';
import {Switch} from 'react-router-dom';
import shopifyConfig from '../shopify.config';
import {Suspense} from 'react';

export default function App({...serverState}) {
  return (
    <ShopifyServerProvider shopifyConfig={shopifyConfig} {...serverState}>
      <Suspense fallback={'Loading...'}>
        <Switch>
          <DefaultRoutes
            pages={serverState.pages}
            serverState={serverState}
            fallback="Not Found"
          />
        </Switch>
      </Suspense>
    </ShopifyServerProvider>
  );
}
