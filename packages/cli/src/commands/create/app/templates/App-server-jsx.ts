export default function () {
  return `
  import {
    ShopifyServerProvider,
    DefaultRoutes,
  } from '@shopify/hydrogen';
  import {Switch} from 'react-router-dom';
  import {Suspense} from 'react';
  
  import shopifyConfig from '../shopify.config';
  
  export default function App({pages, ...serverState}) {
    return (
      <ShopifyServerProvider shopifyConfig={shopifyConfig} {...serverState}>
        <Suspense fallback="Loading...">
          <Switch>
            <DefaultRoutes
              pages={pages}
              serverState={serverState}
              fallback={() => <div>Not found</div>}
            />
          </Switch>
        </Suspense>
      </ShopifyServerProvider>
    );
  }
`;
}
