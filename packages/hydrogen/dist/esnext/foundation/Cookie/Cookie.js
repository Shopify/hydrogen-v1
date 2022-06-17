import { parse, stringify as stringifyCookie } from 'worktop/cookie';
import { log } from '../../utilities/log';
import { parseJSON } from '../../utilities/parse';
const reservedCookieNames = ['mac', 'user_session_id'];
/** The `Cookie` component helps you build your own custom cookie and session implementations. All
 * [Hydrogen session storage mechanisms](https://shopify.dev/custom-storefronts/hydrogen/framework/sessions#types-of-session-storage) use the
 * same configuration options as what's available in `Cookie`.
 */
export class Cookie {
    /** The name of the cookie stored in the browser. */
    name;
    /** An optional object to configure [how the cookie is persisted in the browser](https://shopify.dev/api/hydrogen/components/framework/cookie#cookie-options). */
    options;
    data;
    constructor(name, options = {}) {
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
                    : new Date(Date.now() + 604800000), // default one week
        };
        this.name = name;
        this.data = {};
    }
    parse(cookie) {
        try {
            const data = parseJSON(parse(cookie)[this.name]);
            this.data = data;
        }
        catch (e) {
            // failure to parse cookie
        }
        return this.data;
    }
    set(key, value) {
        this.data[key] = value;
    }
    setAll(data) {
        this.data = data;
    }
    serialize() {
        return stringifyCookie(this.name, JSON.stringify(this.data), this.options);
    }
    destroy() {
        this.data = {};
        return stringifyCookie(this.name, '', {
            ...this.options,
            expires: new Date(0),
        });
    }
    get expires() {
        return this.options.expires.getTime();
    }
    setSessionid(sid) {
        return this.set('sid', sid);
    }
    getSessionId(request) {
        const cookieValue = request.headers.get('cookie');
        if (cookieValue) {
            return this.parse(cookieValue).sid;
        }
        return null;
    }
}
