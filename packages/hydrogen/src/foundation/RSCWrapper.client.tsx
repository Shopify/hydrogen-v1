import React, {Suspense} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {useServerResponse2} from '../framework/Hydration/rsc';

export function RSCWrapper({componentId}: {componentId: string}) {
  console.log('RSCWrapper', componentId);
  const response = useServerResponse2({
    componentId,
  });

  return (
    <>
      <ErrorBoundary
        fallbackRender={() => {
          return null;
        }}
      >
        <Suspense fallback={null}>{response.readRoot()}</Suspense>
      </ErrorBoundary>
    </>
  );
}
