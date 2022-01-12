export type RequestCacheResult<T> =
  | RequestCacheResultSuccess<T>
  | RequestCacheResultError;

type RequestCacheResultSuccess<T> = {
  data: T;
  error?: never;
};

type RequestCacheResultError = {
  data?: never;
  error: Response;
};
