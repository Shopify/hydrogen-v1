import React, {Suspense, useEffect, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {
  createFromFetch,
  // @ts-ignore
} from '@shopify/hydrogen/vendor/react-server-dom-vite';
import {RSC_PATHNAME} from '../../constants';

const cache = new Map();

export function RSCSubRouteClient({state}: {state: any}) {
  const [response, setResponse] = useState();

  useEffect(() => {
    setResponse(getSubServerResponse(state));
  }, [state, response]);

  return (
    <ErrorBoundary
      fallbackRender={() => {
        return null;
      }}
    >
      <Suspense fallback={null}>
        {/* @ts-ignore */}
        {response && response.readRoot()}
      </Suspense>
    </ErrorBoundary>
  );
}

function getSubServerResponse(state: any) {
  const key = JSON.stringify(state);

  let response = cache.get(key);
  if (response) {
    return response;
  }

  console.log(`${RSC_PATHNAME}?state=` + encodeURIComponent(key));

  response = createFromFetch(
    fetch(`${RSC_PATHNAME}?state=` + encodeURIComponent(key))
  );

  cache.set(key, response);

  return response;
}
