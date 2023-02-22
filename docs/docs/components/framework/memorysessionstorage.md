# MemorySessionStorage


The `MemorySessionStorage` component stores session data within Hydrogen runtime memory.

## Example code

```jsx title="App.server.jsx"
import {defineConfig, MemorySessionStorage} from '@shopify/hydrogen/config';

export default defineConfig({
  shopify: {/*...*/},
  session: MemorySessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
```



## Props

| Prop     | Type                       | Description                                                                                                                                                |
| -------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name     | `string`        | The name of the cookie stored in the browser.                                                                                                              |
| options? | `CookieOptions` | An optional object to configure [how the cookie is persisted in the browser](/components/framework/cookie.md#cookie-options). |

## Component type

The `MemorySessionStorage` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Considerations

- You can store as much data as you want in the session (more than the 4kb cookie limit). However, when you close the Hydrogen server, all session data will be lost.
- If you're running Hydrogen in an Edge worker that frequently shuts down and has cold starts, then your session data will be very volatile.

## Related components

- [`Cookie`](/components/framework/cookie/)
- [`FileSessionStorage`](/components/framework/filesessionstorage/)
- [`CookieSessionStorage`](/components/framework/cookiesessionstorage/)

## Related hooks

- [`useSession`](/hooks/framework/usesession/)

## Related framework topics

- [Session management](https://shopify.dev/custom-storefronts/hydrogen/sessions)
- [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/configuration)
