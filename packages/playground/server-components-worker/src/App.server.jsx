import {DefaultRoutes} from '@shopify/hydrogen';
import {Suspense} from 'react';

export default function App({...serverState}) {
  return (
    <Suspense fallback={'Loading...'}>
      <DefaultRoutes
        pages={serverState.pages}
        serverState={serverState}
        fallback="Not Found"
      />
    </Suspense>
  );
}
