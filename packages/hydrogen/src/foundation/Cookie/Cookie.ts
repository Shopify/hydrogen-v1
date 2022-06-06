import {parse, stringify as stringifyCookie} from 'worktop/cookie';
import {log} from '../../utilities/log';
import {parseJSON} from '../../utilities/parse';

export type CookieOptions = {
  /** Whether to secure the cookie so that [client-side JavaScript can't read the cookie](https://owasp.org/www-community/HttpOnly).
   */
  httpOnly?: boolean;
  /** Whether to secure the cookie so that the browser only sends the cookie over HTTPS. Some
   * browsers [don't work with secure cookies on localhost](https://owasp.org/www-community/controls/SecureCookieAttribute).
   */
  secure?: boolean;
  /** Declares that the cookie should be restricted to a first-party
   * or [same-site](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite) context.
   */
  sameSite?: 'Lax' | 'Strict' | 'None';
  /** Tells the browser that the cookie should only be sent to the server if it's
   * within the [defined path](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#path_attribute).
   */
  path?: string;
  /** [A date on which the cookie will expire](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_the_lifetime_of_a_cookie).
   * If the date is in the past, then the browser will remove the cookie.
   */
  expires?: Date;
  /** Secures the cookie so that it's only used on [specific domains](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#domain_attribute).
   */
  domain?: string;
  /** The [number of seconds until the cookie expires](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#max-agenumber).
   * `maxAge` takes precedence over `expires` if both are defined.
   */
  maxAge?: number;
};

const reservedCookieNames = ['mac', 'user_session_id'];

/** The `Cookie` component helps you build your own custom cookie and session implementations. All
 * [Hydrogen session storage mechanisms](https://shopify.dev/custom-storefronts/hydrogen/framework/sessions#types-of-session-storage) use the
 * same configuration options as what's available in `Cookie`.
 */
export class Cookie {
  /** The name of the cookie stored in the browser. */
  name: string;
  /** An optional object to configure [how the cookie is persisted in the browser](https://shopify.dev/api/hydrogen/components/framework/cookie#cookie-options). */
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
      const data = parseJSON(parse(cookie)[this.name]);
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
