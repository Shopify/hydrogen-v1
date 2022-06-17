import { hashKey } from './hash';
/**
 * Wrap the fetch promise in a way that React Suspense understands.
 * Essentially, keep throwing something until you have legit data.
 */
export function wrapPromise(promise) {
    let status = 'pending';
    let response;
    const suspender = promise.then((res) => {
        status = 'success';
        response = res;
    }, (err) => {
        status = 'error';
        response = err;
    });
    const read = () => {
        switch (status) {
            case 'pending':
                throw suspender;
            case 'error':
                throw response;
            default:
                return response;
        }
    };
    return { read };
}
const browserCache = {};
/**
 * Perform an async function in a synchronous way for Suspense support.
 * To be used only in the client.
 * Inspired by https://github.com/pmndrs/suspend-react
 */
function query(key, fn, preload = false) {
    const stringKey = hashKey(key);
    if (browserCache[stringKey]) {
        const entry = browserCache[stringKey];
        if (preload)
            return undefined;
        if (entry.error)
            throw entry.error;
        if (entry.response)
            return entry.response;
        if (!preload)
            throw entry.promise;
    }
    const entry = {
        promise: fn()
            .then((response) => (entry.response = response))
            .catch((error) => (entry.error = error)),
    };
    browserCache[stringKey] = entry;
    if (!preload)
        throw entry.promise;
    return undefined;
}
export const suspendFunction = (key, fn) => query(key, fn);
export const preloadFunction = (key, fn) => query(key, fn, true);
