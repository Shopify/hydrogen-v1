import React, { createContext, useContext } from 'react';
import { getTime } from '../../utilities/timing';
import { hashKey } from '../../utilities/hash';
import { collectQueryTimings } from '../../utilities/log';
// Context to inject current request in SSR
const RequestContextSSR = createContext(null);
// Cache to inject current request in RSC
function requestCacheRSC() {
    return new Map();
}
requestCacheRSC.key = Symbol.for('HYDROGEN_REQUEST');
function getInternalReactDispatcher() {
    // @ts-ignore
    return React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
        .ReactCurrentDispatcher.current;
}
function isRsc() {
    // This flag is added by RSC Vite plugin
    return __HYDROGEN_TEST__ || !!getInternalReactDispatcher().isRsc;
}
// Note: use this only during RSC/Flight rendering. The React dispatcher
// for SSR/Fizz rendering does not implement getCacheForType.
function getCacheForType(resource) {
    const dispatcher = getInternalReactDispatcher();
    // @ts-ignore
    if (__HYDROGEN_TEST__ && !dispatcher.getCacheForType) {
        // Jest does not have access to the RSC runtime, mock it here:
        // @ts-ignore
        return (globalThis.__jestRscCache ??= resource());
    }
    return dispatcher.getCacheForType(resource);
}
export function ServerRequestProvider({ request, children, }) {
    if (isRsc()) {
        // Save the request object in a React cache that is
        // scoped to this current rendering.
        const requestCache = getCacheForType(requestCacheRSC);
        requestCache.set(requestCacheRSC.key, request);
        return children;
    }
    // Use a normal provider in SSR to make the request object
    // available in the current rendering.
    return (React.createElement(RequestContextSSR.Provider, { value: request }, children));
}
export function useServerRequest() {
    const request = isRsc()
        ? getCacheForType(requestCacheRSC)?.get(requestCacheRSC.key)
        : useContext(RequestContextSSR); // eslint-disable-line react-hooks/rules-of-hooks
    if (!request) {
        if (__HYDROGEN_TEST__) {
            // Unit tests are not wrapped in ServerRequestProvider.
            // This mocks it, instead of providing it in every test.
            return { ctx: {} };
        }
        throw new Error('No ServerRequest Context found');
    }
    return request;
}
/**
 * Returns data stored in the request cache.
 * It will throw the promise if data is not ready.
 */
export function useRequestCacheData(key, fetcher) {
    const request = useServerRequest();
    const cache = request.ctx.cache;
    const cacheKey = hashKey(key);
    if (!cache.has(cacheKey)) {
        let result;
        let promise;
        cache.set(cacheKey, () => {
            if (result !== undefined) {
                collectQueryTimings(request, key, 'rendered');
                return result;
            }
            if (!promise) {
                const startApiTime = getTime();
                const maybePromise = fetcher();
                if (!(maybePromise instanceof Promise)) {
                    result = { data: maybePromise };
                    return result;
                }
                promise = maybePromise.then((data) => {
                    result = { data };
                    collectQueryTimings(request, key, 'resolved', getTime() - startApiTime);
                }, (error) => (result = { error }));
            }
            throw promise;
        });
    }
    // Making sure the promise has returned data because it can be initated by a preload request,
    // otherwise, we throw the promise
    const result = cache.get(cacheKey).call();
    if (result instanceof Promise)
        throw result;
    return result;
}
export function preloadRequestCacheData(request, preloadQueries) {
    const cache = request.ctx.cache;
    preloadQueries?.forEach((preloadQuery, cacheKey) => {
        collectQueryTimings(request, preloadQuery.key, 'preload');
        if (!cache.has(cacheKey)) {
            let result;
            let promise;
            cache.set(cacheKey, () => {
                if (result !== undefined) {
                    collectQueryTimings(request, preloadQuery.key, 'rendered');
                    return result;
                }
                if (!promise) {
                    const startApiTime = getTime();
                    promise = preloadQuery.fetcher().then((data) => {
                        result = { data };
                        collectQueryTimings(request, preloadQuery.key, 'resolved', getTime() - startApiTime);
                    }, (error) => {
                        result = { error };
                    });
                }
                return promise;
            });
        }
        cache.get(cacheKey).call();
    });
}
