---
gid: 9b0e7d26-de66-4163-8ac1-69057f2f4146
title: Manage sessions
description: Learn how to work with Hydrogen's built-in support for session management.
---

> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.


<aside class="note beta">
<h4>Experimental feature</h4>

<p>Session management is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

Hydrogen's [Demo Store template](/docs/tutorials/getting-started/templates) comes pre-configured with session support.

By default, session data is persisted within a cookie. You can adjust the session cookie configuration within your [Hydrogen configuration file](/docs/tutorials/configuration#session) for an in-memory storage or file-based storage (NodeJS only), or build your own storage adapter.

## Custom session storage

If you want to persist session data in a custom way, then you can write your own session storage adapter. To do so, you need to implement a function that returns an object:

```ts
// customStorage.js

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
        // When complete, return the serialized cookie
        return cookie.serialize();
      },
      async destroy(request) {
        await customDeleteTheSession();
        // When complete, return the destroyed cookie
        return cookie.destroy();
      },
    };
  };
};
```



## Reading and updating session data

In Hydrogen, you can use the [`useSession`](/api/hydrogen/hooks/framework/usesession) hook to read session data. You can update session data within [API routes](/docs/tutorials/routing#api-routes). API routes are passed a session object for interacting with the session. The session object has the following keys:

| Key       | Description                                                     |
| --------- | --------------------------------------------------------------- |
| `get`     | An async function that resolves with the current session state. |
| `set`     | An async function to modify a portion of the session state.     |
| `destroy` | An async function to destroy the current session.               |

### Example

The following example shows an API route that's used to retrieve, set, and delete a `countryCode` within a session:

```ts
// my-api.server.js

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



The following example shows a server component which reads data from the session:

```ts
// my-component.server.jsx

import {useSession} from '@shopify/hydrogen';

export async function MyComponent() {
  const {countryCode} = useSession();
}
```



> Note:
> Session data is read-only within server components. To update or delete session data, use API functions.

## Building custom session implementations

Hydrogen provides a [`Cookie`](/api/hydrogen/components/framework/cookie) component for building your own custom cookie and session implementations. All [Hydrogen session storage mechanisms](/docs/tutorials/sessions#types-of-session-storage) use the same configuration options as `Cookie`.

## Related components and hooks

- [`Cookie`](/api/hydrogen/components/framework/cookie)
- [`CookieSessionStorage`](/api/hydrogen/components/framework/cookiesessionstorage)
- [`MemorySessionStorage`](/api/hydrogen/components/framework/memorysessionstorage)
- [`FileSessionStorage`](/api/hydrogen/components/framework/filesessionstorage)
- [`useSession`](/api/hydrogen/hooks/framework/usesession)

## Next steps

- Get familiar with the [file-based routing system](/docs/tutorials/routing) that Hydrogen uses.
- Learn about [Hydrogen's configuration properties](/docs/tutorials/configuration) and how to change the location of the configuration file.
