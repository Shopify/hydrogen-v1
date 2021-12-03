import {createContext} from 'react';
import {RenderCacheProviderProps} from './types';

export const RenderCacheContext = createContext<RenderCacheProviderProps>({
  cache: {},
});
