import {CacheSeconds, generateCacheControlHeader} from '../Cache/strategies';
import type {CachingStrategy} from '../../types';
import Redirect from '../Redirect/Redirect.client';
import React from 'react';

export class HydrogenResponse extends Response {
  private wait = false;
  private cacheOptions: CachingStrategy = CacheSeconds();

  private customStatus?: number;
  private customStatusText?: string;

  public get status() {
    return this.customStatus ?? super.status;
  }
  public set status(number: number) {
    this.customStatus = number;
  }

  public get statusText() {
    return this.customStatusText ?? super.statusText;
  }
  public set statusText(text: string) {
    this.customStatusText = text;
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
