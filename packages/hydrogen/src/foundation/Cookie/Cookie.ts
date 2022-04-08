import {parse, stringify as stringifyCookie} from 'worktop/cookie';
import {log} from '../../utilities/log';

export type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
  path?: string;
  expires?: Date;
  domain?: string;
  maxAge?: number;
};

const reservedCookieNames = ['mac', 'user_session_id'];
export class Cookie {
  name: string;
  options?: CookieOptions;
  data: Record<string, any>;

  constructor(name: string, options: CookieOptions = {}) {
    if (reservedCookieNames.includes(name)) {
      log.warn(`Warning "${name}" is a reserved cookie name by oxygen!`);
    }

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

  setSessionid(sid: string) {
    return this.set('sid', sid);
  }

  getSessionId(request: Request): string | null {
    const cookieValue = request.headers.get('cookie');

    if (cookieValue) {
      return this.parse(cookieValue).sid;
    }

    return null;
  }
}
