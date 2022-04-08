The Hydrogen framework has built in session management. This guide provides an introduction to sessions in your Hydrogen app.

Sessions are an essential part of an e-commerce website. A session tracks global data unique to each user. That data can contain the products within the cart, site preferences, or user identity. Session data persists across page refreshes, but will eventually expire depending on how it's configured.

# Reading and writing session data

## `useSession` component hook

Within server components, you can read from session data with the `useSession` hook.

### Example code

{% codeblock file, filename: 'component.server.jsx' %}

```jsx
import {useSession} from '@shopify/hydrogen';

export default function ServerComponent() {
  const {countryCode} = useSession();

  return <div>The country code for rendered page: {countryCode}</div>;
}
```

{% endcodeblock %}

### Return value

The `useSession` hook returns all data within the current session. The return type is an object with key value pairs.

### Considerations

- The `useSession` hook is unavailable within client components. If your client components need access to session data, get the data within server components and explicitly pass to the client the data the client needs. The session is likely to contain privileged data, so you should avoid passing _all_ session data to the client.
- Updating session data should not happen within server components or client components. Instead, update session data within API routes.
- The `useSession()` hook will suspend while

## Sessions within API routes

API Rotues are the primary spot where you should update session data. API routes are passed a session object for interacting with the session. This session object has the following keys:

| Key       | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `get`     | Async function that resolves with the current session state. |
| `set`     | Async function to modify a portion of the session state.     |
| `destroy` | Async function to destroy the current session.               |

For example, an API route for getting, setting, and deleting the `countryCode` within a session:

{% codeblock file, filename: 'component.server.jsx' %}

```ts
export async function api(request, {session}) {
  let sessionData, jsonData;

  switch (request.method) {
    case 'GET':
      sessionData = await session.get();
      return {countryCode: sessionData.countryCode};
    case 'POST':
      jsonData = await request.json();
      await session.set('countryCode', jsonData.countryCode);
      return {countryCode: jsonData.countryCode};
    case 'DELETE':
      await session.destroy();
      return;
  }

  return new Response(null, {status: 400});
}
```

{% endcodeblock %}

# Configuring hydrogen sessions

The Hydrogen starter template comes pre-configured with session support. You can adjust the session cookie configuration within `App.server.jsx`:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
export default renderHydrogen(App, {
  routes,
  shopifyConfig,
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
```

{% endcodeblock %}

By default, session data is persisted within a cookie. This can be swapped for an in memory storage, file-based storage (for NodeJS only), or build your own storage adapter.

# Cookie session storage

Cookies are the default session storage mechanism for hydrogen. It is easy and convenient, because you do not need a database or other back-end service to persist the data. Because the amount of data you can store in a cookie is limited by the browser, you should not use cookies if you expect to store large amounts of data (over 4kb).

## Example code

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {renderHydrogen, CookieSessionStorage} from '@shopify/hydrogen';

export default renderHydrogen(App, {
  routes,
  shopifyConfig,
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
```

{% endcodeblock %}

## Arguments

`CookieSessionStorage` takes the following arguments:

| Key             | Required | Description                                                             |
| --------------- | -------- | ----------------------------------------------------------------------- |
| `cookieName`    | Yes      | The name of the cookie stored in the browser.                           |
| `cookieOptions` | No       | An optional object to configure how the cookie is persisted in browser. |

## Considerations

- Do not use `CookieSessionStorage` if you expect to have more than 4kb of data within sessions.

# In-memory session storage

Use the `MemorySessionStorage` to store session data within Hydrogen runtime memory. Cookie configuration is still necessary because a unique session ID is stored within the browser cookie, although associated session data is stored in memory.

## Example code

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {renderHydrogen, MemorySessionStorage} from '@shopify/hydrogen';

export default renderHydrogen(App, {
  routes,
  shopifyConfig,
  session: MemorySessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
```

{% endcodeblock %}

## Arguments

`MemorySessionStorage` takes the following arguments:

| Key             | Required | Description                                                             |
| --------------- | -------- | ----------------------------------------------------------------------- |
| `cookieName`    | Yes      | The name of the cookie stored in the browser.                           |
| `cookieOptions` | No       | An optional object to configure how the cookie is persisted in browser. |

## Considerations

- You can store as much data as you want in the session (more than the 4kb cookie limit) but the downside is that whenever the Hydrogen server shuts down, all session data is lost.
- If you are running Hydrogen in an edge worker that frequently shuts down and has cold starts, your session data will be very volitile.

# File session storage

`FileSessionStorage` persists session data to the file system. This is useful if you need to store a lot of data in the session (more than the 4kb cookie limit) and also have the data persist when Hydrogen restarts. Cookie configuration is still necessary because a unique session ID is stored within the browser cookie, although associated session data is stored in the file system.

**Note: `FileSessionStorage` should only be used in Node deployments**

## Example code

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
// Important! Make sure you import from the right location!
import {
  renderHydrogen,
  FileSessionStorage,
} from '@shopify/hydrogen/FileSessionStorage';

export default renderHydrogen(App, {
  routes,
  shopifyConfig,
  session: MemorySessionStorage('__session', '/home/dev/sessions', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
```

{% endcodeblock %}

## Arguments

`FileSessionStorage` takes the following arguments:

| Key             | Required | Description                                                                                                  |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `cookieName`    | Yes      | The name of the cookie stored in the browser.                                                                |
| `directory`     | Yes      | A directory to store the session files within. Each session is stored in a separate file on the file system. |
| `cookieOptions` | No       | An optional object to configure how the cookie is persisted in browser.                                      |

## Considerations

- Because `FileSessionStorage` relies on the file system, it should not be used in Edge workers, and instead only in NodeJS deployments.

# Custom session storage

If you wish to persist session data in a custom way, you can write your own session storage adapter. To do so, you need to implement a function that returns an object with An example might look like:

{% codeblock file, filename: 'customStorage.js' %}

```ts
import {Cookie} from '@shopify/hydrogen';

export const CookieSessionStorage = function (name, options) {
  return function () {
    const cookie = new Cookie(name, options);
    return {
      async get(request) {
        const sid = cookie.getSessionId(request) || generateNewCookieId();
        const data = await customGetSessionData(sid);
        return data;
      },
      async set(request, value) {
        const sid = cookie.getSessionId(request) || generateNewCookieId();
        cookie.setSessionid(sid);
        await customPersistSessionData(sid, value);

        // when done, make sure to return the serialized cookie!
        return cookie.serialize();
      },
      async destroy(request) {
        await customDeleteTheSession();
        // when done, make sure to return the destoryed cookie!
        return cookie.destroy();
      },
    };
  };
};
```

{% endcodeblock %}

# Cookies

Hydrogen provides a helper `Cookie` class for building your own custom cookie and session implementations. All Hydrogen session storage mechanisms use the same configuration options as what's available in `Cookie`.

## Example code

{% codeblock file, filename: 'custom.js' %}

```js
import {Cookie} from '@shopify/hydrogen';

let cookie = new Cookie('__session', {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 30,
});

cookie.parse(request.headers.get('cookie'));
cookie.set('new', 'data');
response.headers.set('Set-Cookie', cookie.serialize());
```

{% endcodeblock %}

## Cookie options

Options for how the cookie is persisted within the browser. Most of these properties are derived from the [cookie specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies):

| Key        | type                        | Description                                                                                                                                                                                                            |
| ---------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `expires`  | Date                        | A date in which the cookie will expire. If in the past, then the browser will remove it. [Read more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_the_lifetime_of_a_cookie)                        |
| `maxAge`   | number                      | Indicate the number of seconds until the cookie expires. `maxAge` takes precedence over `expires` if both are defined. [Read more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#max-agenumber) |
| `httpOnly` | boolean                     | Secure the cookie so that client JavaScript is unable to read it. [Read more](https://owasp.org/www-community/HttpOnly)                                                                                                |
| `secure`   | boolean                     | Secure the cookie so that the browser only sends it over HTTPS. Some browsers don't work with secure cookies on localhost. [Read more](https://owasp.org/www-community/controls/SecureCookieAttribute)                 |
| `sameSite` | "lax" \| "strict" \| "none" | Declare that the cookie should be restricted to a first-party or same-site context. [Read more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)                                         |
| `path`     | string                      | Tell the browser that the cookie should only be sent the server if within the definedk path. [Read more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#path_attribute).                                    |
| `domain`   | string                      | Secure the cookie so that it is only used on specific domains. [Read more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#domain_attribute)                                                                 |
