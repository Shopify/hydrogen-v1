import {createContext} from 'react';
import type {RenderCacheProviderProps} from './types';

export const RenderCacheContext = createContext<RenderCacheProviderProps>({
  cache: {},
});
