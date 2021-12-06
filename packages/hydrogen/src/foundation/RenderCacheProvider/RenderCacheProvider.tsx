import React from 'react';
import {RenderCacheContext} from './RenderCacheContext';
import type {RenderCacheProviderProps} from './types';

export function RenderCacheProvider({
  cache,
  preloadCache,
  children,
}: RenderCacheProviderProps) {
  return (
    <RenderCacheContext.Provider
      value={{
        cache,
        preloadCache,
      }}
    >
      {children}
    </RenderCacheContext.Provider>
  );
}
