import { parseJSON } from '../../../utilities/parse';
import { suspendFunction, preloadFunction } from '../../../utilities/suspense';
/**
 * Fetch a URL for use in a client component Suspense boundary.
 */
export function fetchSync(url, options) {
    const [text, response] = suspendFunction([url, options], async () => {
        const response = await globalThis.fetch(url, options);
        const text = await response.text();
        return [text, response];
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
export function preload(url, options) {
    preloadFunction([url, options], async () => {
        const response = await globalThis.fetch(url, options);
        const text = await response.text();
        return [text, response];
    });
}
