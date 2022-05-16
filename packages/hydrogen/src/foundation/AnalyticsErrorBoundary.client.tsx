import React from 'react';
import type {ReactNode} from 'react';
import {ErrorBoundary} from 'react-error-boundary';

export default function AnalyticsErrorBoundary({
  children,
}: {
  children: ReactNode;
}) {
  // Analytics fail to load, most likely due to an ad blocker
  return (
    <ErrorBoundary
      fallbackRender={() => {
        return null;
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
