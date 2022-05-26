import {CacheSeconds, generateCacheControlHeader} from '../CachingStrategy';
import type {CachingStrategy} from '../../types';
import Redirect from '../../foundation/Redirect/Redirect.client';
import React from 'react';

export class ServerComponentResponse extends Response {
  private wait = false;
  private cacheOptions: CachingStrategy = CacheSeconds();

  public customStatus?: {code?: number; text?: string};

  /**
   * Allow custom body to be a string or a Promise.
   */
  public customBody: string | Promise<string> = '';

  constructor(
    body?: BodyInit | null | undefined,
    init?: ResponseInit | undefined
  ) {
    super(body, init);

    this.headers.set(
      'cache-control',
      generateCacheControlHeader(this.cacheOptions)
    );
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
    this.headers.set(
      'cache-control',
      generateCacheControlHeader(this.cacheOptions)
    );
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
