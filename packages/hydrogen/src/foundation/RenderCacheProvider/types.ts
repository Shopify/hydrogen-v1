export type RenderCache = {
  [key: string]: () => unknown;
};

export type RenderCacheProviderProps = {
  /** A cache to hold all queries performed within a render request */
  cache: RenderCache;
  children?: React.ReactNode;
};

export interface RenderCacheResult<T> {
  data: T;
}
