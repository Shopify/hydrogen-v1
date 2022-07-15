import React, {Suspense} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {
  createFromFetch,
  // @ts-ignore
} from '@shopify/hydrogen/vendor/react-server-dom-vite';
import {RSC_PATHNAME} from '../../constants';

export function RSCSubRouteClient({state}: {state: any}) {
  const key = JSON.stringify(state);
  const response = createFromFetch(
    fetch(`${RSC_PATHNAME}?state=` + encodeURIComponent(key))
  );

  return (
    <ErrorBoundary
      fallbackRender={() => {
        return null;
      }}
    >
      <Suspense fallback={null}>{response.readRoot()}</Suspense>
    </ErrorBoundary>
  );
}
