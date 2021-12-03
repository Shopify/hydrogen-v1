import React from 'react';
import {RenderCacheProviderProps} from './types';
import {RenderCacheContext} from './RenderCacheContext';

export function RenderCacheProvider({
  cache,
  children,
}: RenderCacheProviderProps) {
  return (
    <RenderCacheContext.Provider value={{cache}}>
      {children}
    </RenderCacheContext.Provider>
  );
}
