import {
  CacheSeconds,
  generateCacheControlHeader,
} from '../../framework/CachingStrategy';
import type {CachingStrategy} from '../../types';
import Redirect from '../Redirect/Redirect.client';
import React from 'react';

export class HydrogenResponse extends Response {
  private wait = false;
  private cacheOptions: CachingStrategy = CacheSeconds();

  public customStatus?: {code?: number; text?: string};

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

  writeHead({
    status,
    statusText,
    headers,
  }: {
    status?: number;
    statusText?: string;
    headers?: Record<string, any>;
  } = {}) {
    if (status || statusText) {
      this.customStatus = {code: status, text: statusText};
    }

    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        this.headers.set(key, value);
      }
    }
  }

  redirect(location: string, status = 307) {
    // writeHead is used for SSR, so that the server responds with a redirect
    this.writeHead({status, headers: {location}});

    // in the case of an RSC request, instead render a client component that will redirect
    return React.createElement(Redirect, {to: location});
  }
}
