import React from 'react';
import {RenderCacheContext} from './RenderCacheContext';
import type {RenderCacheProviderProps} from './types';

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
