---
gid: 8e7f9698-406d-4f42-b895-0ab3973599c1
title: CookieSessionStorage
description: The CookieSessionStorage component is the default session storage mechanism for Hydrogen.
---

The `CookieSessionStorage` component is the default session storage mechanism for Hydrogen.

## Example code

{% codeblock file, filename: 'hydrogen.config.js' %}

```jsx
import {defineConfig, CookieSessionStorage} from '@shopify/hydrogen/config';

export default defineConfig({
  shopify: {/*...*/},
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

## Props

| Prop           | Type                       | Description                                                                                                                             |
| -------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| cookieName     | <code>string</code>        | The name of the cookie stored in the browser.                                                                                           |
| cookieOptions? | <code>CookieOptions</code> | An optional object to configure [how the cookie is persisted in the browser](/docs/components/framework/cookie#cookie-options). |

## Component type

The `CookieSessionStorage` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Considerations

Don't use `CookieSessionStorage` if you expect to have more than 4kb of data within sessions.

## Related components

- [`Cookie`](https://shopify.dev/api/hydrogen/components/framework/cookie)
- [`MemorySessionStorage`](https://shopify.dev/api/hydrogen/components/framework/memorysessionstorage)
- [`FileSessionStorage`](https://shopify.dev/api/hydrogen/components/framework/filesessionstorage)

## Related hooks

- [`useSession`](https://shopify.dev/api/hydrogen/hooks/framework/usesession)

## Related framework topics

- [Session management](https://shopify.dev/custom-storefronts/hydrogen/sessions)
- [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/configuration)
