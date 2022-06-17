import type { FetchResponse } from '../types';
/**
 * Fetch a URL for use in a client component Suspense boundary.
 */
export declare function fetchSync(url: string, options?: RequestInit): FetchResponse;
/**
 * Preload a URL for use in  a client component Suspense boundary.
 * Useful for placing higher in the tree to avoid waterfalls.
 */
export declare function preload(url: string, options?: RequestInit): void;
