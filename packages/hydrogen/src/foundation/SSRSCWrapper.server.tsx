import React, {Suspense} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {RSCWrapper} from './RSCWrapper.client';

export function SSRSCWrapper({
  ssrMode,
  componentId,
  Component,
}: {
  ssrMode: boolean;
  componentId: string;
  Component: any;
}) {
  if (ssrMode) {
    return (
      <>
        <ErrorBoundary
          fallbackRender={() => {
            return null;
          }}
        >
          <Suspense fallback={null}>
            <Component />
          </Suspense>
        </ErrorBoundary>
      </>
    );
  } else {
    return <RSCWrapper componentId={componentId} />;
  }
}
