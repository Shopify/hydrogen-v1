import { Cookie } from '../Cookie/Cookie';
/** The `CookieSessionStorage` component is the default session storage mechanism for Hydrogen.
 */
export const CookieSessionStorage = function (
/** The name of the cookie stored in the browser. */
name, 
/** An optional object to configure [how the cookie is persisted in the browser](https://shopify.dev/api/hydrogen/components/framework/cookie#cookie-options). */
options) {
    return function () {
        const cookie = new Cookie(name, options);
        let parsed = false;
        return {
            async get(request) {
                if (!parsed) {
                    const cookieValue = request.headers.get('cookie');
                    cookie.parse(cookieValue || '');
                    parsed = true;
                }
                return cookie.data;
            },
            async set(request, value) {
                cookie.setAll(value);
                return cookie.serialize();
            },
            async destroy(request) {
                // @todo - set expires for Date in past
                return cookie.destroy();
            },
        };
    };
};
