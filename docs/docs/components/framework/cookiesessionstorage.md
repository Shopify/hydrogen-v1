# CookieSessionStorage


The `CookieSessionStorage` component is the default session storage mechanism for Hydrogen.

## Example code

```jsx title="hydrogen.config.js"
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



## Props

| Prop           | Type                       | Description                                                                                                                             |
| -------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| cookieName     | `string`        | The name of the cookie stored in the browser.                                                                                           |
| cookieOptions? | `CookieOptions` | An optional object to configure [how the cookie is persisted in the browser](/components/framework/cookie.md#cookie-options). |

## Component type

The `CookieSessionStorage` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Considerations

Don't use `CookieSessionStorage` if you expect to have more than 4kb of data within sessions.

## Related components

- [`Cookie`](/components/framework/cookie/)
- [`MemorySessionStorage`](/components/framework/memorysessionstorage/)
- [`FileSessionStorage`](/components/framework/filesessionstorage/)

## Related hooks

- [`useSession`](/hooks/framework/usesession/)

## Related framework topics

- [Session management](https://shopify.dev/custom-storefronts/hydrogen/sessions)
- [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/configuration)
