import {
  CacheShort,
  generateCacheControlHeader,
} from '../Cache/strategies/index.js';
import type {CachingStrategy} from '../../types.js';
import Redirect from '../Redirect/Redirect.client.js';
import React from 'react';

export class HydrogenResponse extends Response {
  private wait = false;
  private sent = false;
  private cacheOptions: CachingStrategy = CacheShort();

  public status = 200;
  public statusText = '';

  markAsSent() {
    this.sent = true;
  }

  /**
   * Buffer the current response until all queries have resolved,
   * and prevent it from streaming back early.
   */
  doNotStream() {
    if (!this.sent) {
      this.wait = true;
    }
  }

  canStream() {
    return !this.wait;
  }

  cache(options?: CachingStrategy) {
    if (options) {
      this.cacheOptions = options;
    }

    return this.cacheOptions;
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
