export default function () {
  return `
  import {
    ShopifyServerProvider,
    DefaultRoutes,
  } from '@shopify/hydrogen';
  import {Switch} from 'react-router-dom';
  import {Suspense} from 'react';
  
  import shopifyConfig from '../shopify.config';
  
  export default function App({...serverState}) {
    const pages = import.meta.globEager('./pages/**/*.server.[jt]sx');
  
    return (
      <ShopifyServerProvider shopifyConfig={shopifyConfig} {...serverState}>
        <Suspense fallback="Loading...">
          <DefaultRoutes
            pages={pages}
            serverState={serverState}
            fallback={() => <div>Not found</div>}
          />
        </Suspense>
      </ShopifyServerProvider>
    );
  }
`;
}
