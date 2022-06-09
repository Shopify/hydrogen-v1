import {CacheSeconds, generateCacheControlHeader} from '../Cache/strategies';
import type {CachingStrategy} from '../../types';
import Redirect from '../Redirect/Redirect.client';
import React from 'react';

const PROXY_KEYS = ['status', 'statusText'] as Array<string | Symbol>;

export class HydrogenResponse extends Response {
  private wait = false;
  private cacheOptions: CachingStrategy = CacheSeconds();

  private proxy = Object.create(null);
  // @ts-ignore
  public status: number;
  // @ts-ignore
  public statusText: string;

  constructor(...args: ConstructorParameters<typeof Response>) {
    super(...args);

    return new Proxy(this, {
      get(target, key) {
        return target.proxy[key] ?? Reflect.get(target, key);
      },
      set(target, key, value) {
        return Reflect.set(
          PROXY_KEYS.includes(key) ? target.proxy : target,
          key,
          value
        );
      },
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

  cache(options: CachingStrategy) {
    this.cacheOptions = options;
  }

  get cacheControlHeader(): string {
    return generateCacheControlHeader(this.cacheOptions);
  }

  redirect(location: string, status = 307) {
    this.status = status;
    this.headers.set('location', location);

    // in the case of an RSC request, instead render a client component that will redirect
    return React.createElement(Redirect, {to: location});
  }
}
