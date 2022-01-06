import {createContext} from 'react';
import type {RenderCacheProviderProps} from './types';

let clearDefaultCacheTimeout: any;

export const RenderCacheContext = createContext<RenderCacheProviderProps>({
  cache: new Proxy({} as RenderCacheProviderProps['cache'], {
    get(target, key: string) {
      clearTimeout(clearDefaultCacheTimeout);
      clearDefaultCacheTimeout = setTimeout(() => {
        target = {};
      }, 3000);
      return target[key];
    },
    set(target, key: string, value) {
      target[key] = value;
      return true;
    },
  }),
});
