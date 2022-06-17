import { Cookie } from '../Cookie/Cookie';
import { v4 as uid } from 'uuid';
/** The `MemorySessionStorage` component stores session data within Hydrogen runtime memory.
 */
export const MemorySessionStorage = function (
/** The name of the cookie stored in the browser. */
name, 
/** An optional object to configure [how the cookie is persisted in the browser](https://shopify.dev/api/hydrogen/components/framework/cookie#cookie-options). */
options) {
    const sessions = new Map();
    return function () {
        const cookie = new Cookie(name, options);
        return {
            async get(request) {
                const sid = cookie.getSessionId(request);
                let sessionData;
                if (sid && sessions.has(sid)) {
                    const { expires, data } = sessions.get(sid);
                    if (expires < new Date().getTime()) {
                        sessions.delete(sid);
                        sessionData = {};
                    }
                    else {
                        sessionData = data;
                    }
                }
                else {
                    sessionData = {};
                }
                return sessionData;
            },
            async set(request, value) {
                let sid = cookie.getSessionId(request);
                if (!sid) {
                    sid = uid();
                }
                sessions.set(sid, {
                    data: value,
                    expires: cookie.expires,
                });
                cookie.setSessionid(sid);
                return cookie.serialize();
            },
            async destroy(request) {
                const sid = cookie.getSessionId(request);
                if (sid) {
                    sessions.delete(sid);
                }
                return cookie.destroy();
            },
        };
    };
};
