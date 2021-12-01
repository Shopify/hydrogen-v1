import React, {useMemo} from 'react';
import {RequestProviderProps} from './types';
import {RequestContext} from './RequestContext';

export function RequestServerProvider({
  requestId,
  children,
}: RequestProviderProps) {
  const requestProviderValue = useMemo(
    () => ({
      requestId,
    }),
    [requestId]
  );

  return (
    <RequestContext.Provider value={requestProviderValue}>
      {children}
    </RequestContext.Provider>
  );
}
