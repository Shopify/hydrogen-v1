import {parseJSON} from '../../../utilities/parse';
import {suspendFunction, preloadFunction} from '../../../utilities/suspense';
import type {FetchResponse} from '../types';

/**
 * Fetch a URL for use in a client component Suspense boundary.
 */
export function fetchSync(url: string, options?: RequestInit): FetchResponse {
  const [text, response] = suspendFunction([url, options], async () => {
    const response = await globalThis.fetch(
      new URL(url, window.location.origin),
      options
    );

    const text = await response.text();

    return [text, response] as [string, Response];
  });

  return {
    response,
    json: () => parseJSON(text),
    text: () => text,
  };
}

/**
 * Preload a URL for use in  a client component Suspense boundary.
 * Useful for placing higher in the tree to avoid waterfalls.
 */
export function preload(url: string, options?: RequestInit) {
  preloadFunction([url, options], async () => {
    const response = await globalThis.fetch(url, options);
    const text = await response.text();

    return [text, response] as [string, Response];
  });
}
