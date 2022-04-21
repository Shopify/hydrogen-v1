---
gid: 0bd2dbee-c0ed-4e7c-8659-6697696d945a
title: MemorySessionStorage
description: The MemorySessionStorage component stores session data within Hydrogen runtime memory.
---

The `MemorySessionStorage` component stores session data within Hydrogen runtime memory.

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

## Props

| Prop           | Type                       | Description                                                                                                                             |
| -------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| cookieName     | <code>string</code>        | The name of the cookie stored in the browser.                                                                                           |
| cookieOptions? | <code>CookieOptions</code> | An optional object to configure [how the cookie is persisted in the browser](/api/hydrogen/components/framework/cookie#cookie-options). |

## Component type

The `MemorySessionStorage` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Considerations

- You can store as much data as you want in the session (more than the 4kb cookie limit). However, when you close the Hydrogen server, all session data will be lost.
- If you're running Hydrogen in an Edge worker that frequently shuts down and has cold starts, then your session data will be very volatile.

## Related components

- [`Cookie`](https://shopify.dev/api/hydrogen/components/framework/cookie)
- [`FileSessionStorage`](https://shopify.dev/api/hydrogen/components/framework/filesessionstorage)
- [`CookieSessionStorage`](https://shopify.dev/api/hydrogen/components/framework/cookiesessionstorage)

## Related hooks

- [`useSession`](https://shopify.dev/api/hydrogen/hooks/framework/usesession)
