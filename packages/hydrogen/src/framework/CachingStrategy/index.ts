import type {
  CachingStrategy,
  AllCacheOptions,
  NoStoreStrategy,
} from '../../types';

const PUBLIC = 'public';
const PRIVATE = 'private';
const NO_STORE = 'no-store';

const optionMapping: {
  [key: string]: string;
} = {
  maxAge: 'max-age',
  staleWhileRevalidate: 'stale-while-revalidate',
  sMaxAge: 's-maxage',
  staleIfError: 'stale-if-error',
};

export function generateCacheControlHeader(
  cacheOptions: CachingStrategy
): string {
  let cacheControl: string[] = [];
  Object.keys(cacheOptions).forEach((key: string) => {
    if (key === 'mode') {
      cacheControl.push(cacheOptions[key] as string);
    } else if (optionMapping[key]) {
      cacheControl.push(
        `${optionMapping[key]}=${cacheOptions[key as keyof CachingStrategy]}`
      );
    }
  });
  return cacheControl.join(', ');
}

export function NoStore(): NoStoreStrategy {
  return {
    mode: NO_STORE,
  };
}

function guardExpirableModeType(overrideOptions?: CachingStrategy) {
  if (
    overrideOptions?.mode &&
    overrideOptions?.mode !== PUBLIC &&
    overrideOptions?.mode !== PRIVATE
  ) {
    throw Error("'mode' must be either 'public' or 'private'");
  }
}

export function CacheSeconds(
  overrideOptions?: CachingStrategy
): AllCacheOptions {
  guardExpirableModeType(overrideOptions);
  return {
    mode: PUBLIC,
    maxAge: 1,
    staleWhileRevalidate: 9,
    ...overrideOptions,
  };
}

export function CacheHours(overrideOptions?: CachingStrategy): AllCacheOptions {
  guardExpirableModeType(overrideOptions);
  return {
    mode: PUBLIC,
    maxAge: 1800,
    staleWhileRevalidate: 1800,
    ...overrideOptions,
  };
}

export function CacheDays(overrideOptions?: CachingStrategy): AllCacheOptions {
  guardExpirableModeType(overrideOptions);
  return {
    mode: PUBLIC,
    maxAge: 3600,
    staleWhileRevalidate: 82800,
    ...overrideOptions,
  };
}

export function CacheMonths(
  overrideOptions?: CachingStrategy
): AllCacheOptions {
  guardExpirableModeType(overrideOptions);
  return {
    mode: PUBLIC,
    maxAge: 1296000,
    staleWhileRevalidate: 1296000,
    ...overrideOptions,
  };
}

export function CacheCustom(overrideOptions: CachingStrategy): AllCacheOptions {
  return overrideOptions as AllCacheOptions;
}
