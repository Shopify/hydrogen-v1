import { parseJSON } from '../../../utilities/parse';
import { useQuery } from '../../useQuery/hooks';
/**
 * The `fetchSync` hook makes API requests and is the recommended way to make simple fetch calls on the server and the client.
 * It's designed similar to the [Web API's `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch), only in a way
 * that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html).
 */
export function fetchSync(url, options) {
    const { cache, preload, shouldCacheResponse, ...requestInit } = options ?? {};
    const { data: useQueryResponse, error } = useQuery(// eslint-disable-line react-hooks/rules-of-hooks
    [url, requestInit], async () => {
        const response = await globalThis.fetch(url, requestInit);
        const text = await response.text();
        return [text, response];
    }, {
        cache,
        preload,
        shouldCacheResponse,
    });
    if (error) {
        throw error;
    }
    const [data, response] = useQueryResponse;
    return {
        response,
        json: () => parseJSON(data),
        text: () => data,
    };
}
