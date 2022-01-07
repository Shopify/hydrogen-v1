export type RenderCache = {
  [key: string]: () => unknown;
};

export type RenderCacheProviderProps = {
  /** A cache to hold all queries performed within a render request */
  cache: RenderCache;
  children?: React.ReactNode;
};

export type RenderCacheResult<T> =
  | RenderCacheResultSuccess<T>
  | RenderCacheResultError;

type RenderCacheResultSuccess<T> = {
  data: T;
  error?: never;
};

type RenderCacheResultError = {
  data?: never;
  error: Response;
};
