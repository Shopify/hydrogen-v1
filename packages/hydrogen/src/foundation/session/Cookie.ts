import {parse, stringify as stringifyCookie} from 'worktop/cookie';
import type {CookieSessionOptions} from './CookieSessionStorage';

export class Cookie {
  name: string;
  options?: CookieSessionOptions;
  data: Record<string, any>;

  constructor(name: string, options: CookieSessionOptions = {}) {
    this.options = options;
    this.options = {
      ...this.options,
      expires:
        // maxAge takes precedence
        typeof options.maxAge !== 'undefined'
          ? new Date(Date.now() + options.maxAge * 1000)
          : options.expires
          ? options.expires
          : new Date(Date.now() + 604_800_000), // default one week
    };
    this.name = name;
    this.data = {};
  }

  parse(cookie: string) {
    try {
      const data = JSON.parse(parse(cookie)[this.name]);
      this.data = data;
    } catch (e) {
      // failure to parse cookie
    }
    return this.data;
  }

  set(key: string, value: string) {
    this.data[key] = value;
  }

  setAll(data: Record<string, string>) {
    this.data = data;
  }

  serialize(): string {
    return stringifyCookie(this.name, JSON.stringify(this.data), this.options);
  }

  destroy(): string {
    this.data = {};
    return stringifyCookie(this.name, '', {
      ...this.options,
      expires: new Date(0),
    });
  }

  get expires(): number {
    return this.options!.expires!.getTime();
  }
}
