import type {
  CachingStrategy,
  BaseCachingStrategy,
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

export function generateCacheControlHeader(cacheOptions: any): string {
  let cacheControl: string[] = [];
  Object.keys(cacheOptions).forEach((key: string) => {
    if (key === 'mode') {
      cacheControl.push(cacheOptions[key]);
    } else if (optionMapping[key]) {
      cacheControl.push(
        `${optionMapping[key]}=${cacheOptions[key as keyof CachingStrategy]}`
      );
    } else {
      cacheControl.push(`${key}=${cacheOptions[key]}`);
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
    throw Error("mode must be either 'public' or 'private'");
  }
}

export function TenSecondCache(
  overrideOptions?: CachingStrategy
): BaseCachingStrategy {
  guardExpirableModeType(overrideOptions);
  return {
    mode: PUBLIC,
    maxAge: 1,
    staleWhileRevalidate: 9,
    ...overrideOptions,
  };
}

export function OneHourCache(
  overrideOptions?: CachingStrategy
): BaseCachingStrategy {
  guardExpirableModeType(overrideOptions);
  return {
    mode: PUBLIC,
    maxAge: 1800,
    staleWhileRevalidate: 1800,
    ...overrideOptions,
  };
}

export function OneDayCache(
  overrideOptions?: CachingStrategy
): BaseCachingStrategy {
  guardExpirableModeType(overrideOptions);
  return {
    mode: PUBLIC,
    maxAge: 3600,
    staleWhileRevalidate: 82800,
    ...overrideOptions,
  };
}

export function OneMonthCache(
  overrideOptions?: CachingStrategy
): BaseCachingStrategy {
  guardExpirableModeType(overrideOptions);
  return {
    mode: PUBLIC,
    maxAge: 1296000,
    staleWhileRevalidate: 1296000,
    ...overrideOptions,
  };
}
