import type { CachingStrategy, AllCacheOptions, NoStoreStrategy } from '../../../types';
export declare const NO_STORE = "no-store";
export declare function generateCacheControlHeader(cacheOptions: CachingStrategy): string;
export declare function CacheNone(): NoStoreStrategy;
export declare function CacheShort(overrideOptions?: CachingStrategy): AllCacheOptions;
export declare function CacheLong(overrideOptions?: CachingStrategy): AllCacheOptions;
export declare function CacheCustom(overrideOptions: CachingStrategy): AllCacheOptions;
