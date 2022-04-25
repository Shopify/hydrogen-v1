import {renderToString} from 'react-dom/server';
import {CacheSeconds, generateCacheControlHeader} from '../CachingStrategy';
import type {CachingStrategy} from '../../types';
import Redirect from '../../foundation/Redirect/Redirect.client';
import React from 'react';
import type {BodyInit, ResponseInit} from 'undici';

export class ServerComponentResponse implements Response {
  private wait = false;
  private cacheOptions?: CachingStrategy;

  public customStatus?: {code?: number; text?: string};

  /**
   * Allow custom body to be a string or a Promise.
   */
  public customBody: string | Promise<string> = '';

  public session: {
    set: (key: string, value: string) => void;
    get: () => Record<string, string>;
    destroy: () => void;
  };

  private _response: Response;

  constructor(body?: BodyInit, init?: ResponseInit) {
    // @ts-ignore
    this._response = new Response(body, init);
    this.headers = new Headers(init?.headers as any);
    this.session = {
      set(key, value) {},
      get() {
        return {};
      },
      destroy() {},
    };
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
    return generateCacheControlHeader(this.cacheOptions || CacheSeconds());
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

  /**
   * Send the response from a Server Component. Renders React components to string,
   * and returns `null` to make React happy.
   */
  send(body: any) {
    if (
      typeof body === 'object' &&
      body.$$typeof === Symbol.for('react.element')
    ) {
      this.customBody = renderToString(body);
    } else {
      this.customBody = body;
    }

    return null;
  }

  public headers: Headers;

  get ok() {
    return this._response.ok;
  }
  get redirected() {
    return this._response.redirected;
  }
  get status() {
    return this._response.status;
  }
  get statusText() {
    return this._response.statusText;
  }
  get type() {
    return this._response.type;
  }
  get url() {
    return this._response.url;
  }
  get body() {
    return this._response.body;
  }
  get bodyUsed() {
    return this._response.bodyUsed;
  }
  arrayBuffer() {
    return this._response.arrayBuffer();
  }
  blob() {
    return this._response.blob();
  }
  formData() {
    return this._response.formData();
  }
  text() {
    return this._response.text();
  }
  json() {
    return this._response.json();
  }
  clone() {
    return new ServerComponentResponse(this._response.body as any, {
      headers: this.headers as any,
      status: this.status,
      statusText: this.statusText,
    });
  }
}
