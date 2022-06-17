import { CacheShort, generateCacheControlHeader } from '../Cache/strategies';
import Redirect from '../Redirect/Redirect.client';
import React from 'react';
export class HydrogenResponse extends Response {
    wait = false;
    cacheOptions = CacheShort();
    proxy = Object.defineProperties(Object.create(null), {
        // Default values:
        status: { value: 200, writable: true },
        statusText: { value: '', writable: true },
    });
    // @ts-ignore
    status;
    // @ts-ignore
    statusText;
    constructor(...args) {
        super(...args);
        return new Proxy(this, {
            get: (target, key) => target.proxy[key] ?? Reflect.get(target, key),
            set: (target, key, value) => Reflect.set(key in target.proxy ? target.proxy : target, key, value),
        });
    }
    /**
     * Buffer the current response until all queries have resolved,
     * and prevent it from streaming back early.
     */
    doNotStream() {
        this.wait = true;
    }
    canStream() {
        return !this.wait;
    }
    cache(options) {
        if (options) {
            this.cacheOptions = options;
        }
        return this.cacheOptions;
    }
    get cacheControlHeader() {
        return generateCacheControlHeader(this.cacheOptions);
    }
    redirect(location, status = 307) {
        this.status = status;
        this.headers.set('location', location);
        // in the case of an RSC request, instead render a client component that will redirect
        return React.createElement(Redirect, { to: location });
    }
}
