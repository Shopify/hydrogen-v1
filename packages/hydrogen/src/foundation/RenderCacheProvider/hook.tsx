import {useContext} from 'react';
import {RenderCacheContext} from './RenderCacheContext';
import {hashKey} from '../../framework/cache';

import type {QueryKey} from '../../types';
import type {RenderCacheProviderProps, RenderCacheResult} from './types';

/**
 * Returns the unique identifier for the current rendering request
 */
export function useRenderCache(): RenderCacheProviderProps {
  const context = useContext(RenderCacheContext);

  if (!context) {
    throw new Error('No RenderCache Context found');
  }

  return context;
}

/**
 * Returns data stored in the render cache
 * It will throw the promise if data is not ready
 */
export function useRenderCacheData<T>(
  key: QueryKey,
  fetcher: () => Promise<T>
): RenderCacheResult<T> {
  const cacheKey = hashKey(key);
  const {cache} = useRenderCache();

  if (!cache[cacheKey]) {
    let data: RenderCacheResult<T>;
    let promise: Promise<RenderCacheResult<T>>;

    cache[cacheKey] = () => {
      if (data !== undefined) return data;
      if (!promise) {
        promise = fetcher().then(
          (r) => (data = {data: r}),
          (e) => (data = {data: e})
        );
      }
      throw promise;
    };
  }
  return cache[cacheKey]() as RenderCacheResult<T>;
}
