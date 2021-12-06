import {QueryKey} from '../../types';

export type RenderCache = {
  [key: string]: () => unknown;
};

export type PreloadCache = {
  [key: string]: {
    key: QueryKey;
    fetcher: () => Promise<unknown>;
  };
};

export type RenderCacheProviderProps = {
  /** A cache to hold all queries performed within a render request */
  cache: RenderCache;
  preloadCache: PreloadCache;
  children?: React.ReactNode;
};

export interface RenderCacheResult<T> {
  data: T;
}
