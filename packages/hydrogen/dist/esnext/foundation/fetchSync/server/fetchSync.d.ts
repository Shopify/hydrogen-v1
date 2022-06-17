import { type HydrogenUseQueryOptions } from '../../useQuery/hooks';
import type { FetchResponse } from '../types';
/**
 * The `fetchSync` hook makes API requests and is the recommended way to make simple fetch calls on the server and the client.
 * It's designed similar to the [Web API's `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch), only in a way
 * that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html).
 */
export declare function fetchSync(url: string, options?: Omit<RequestInit, 'cache'> & HydrogenUseQueryOptions): FetchResponse;
