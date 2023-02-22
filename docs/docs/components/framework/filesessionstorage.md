# FileSessionStorage


The `FileSessionStorage` component persists session data to the file system.

## Example code

```jsx title="hydrogen.config.js"
import {defineConfig} from '@shopify/hydrogen/config';
import {FileSessionStorage} from '@shopify/hydrogen/FileSessionStorage';

export default defineConfig({
  shopify: {/*...*/},
  session: FileSessionStorage('__session', '/home/dev/sessions', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
```



## Props

| Prop          | Type                       | Description                                                                                                                             |
| ------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| name          | `string`        | The name of the cookie stored in the browser.                                                                                           |
| dir           | `string`        | A directory to store the session files in. Each session is stored in a separate file on the file system.                                |
| cookieOptions | `CookieOptions` | An optional object to configure [how the cookie is persisted in the browser](/components/framework/cookie.md#cookie-options). |

## Component type

The `FileSessionStorage` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Considerations

Because `FileSessionStorage` relies on the file system, it shouldn't be used in Edge workers, and instead only in NodeJS deployments.

## Related components

- [`Cookie`](/components/framework/cookie/)
- [`MemorySessionStorage`](/components/framework/memorysessionstorage/)
- [`CookieSessionStorage`](/components/framework/cookiesessionstorage/)

## Related hooks

- [`useSession`](/hooks/framework/usesession/)

## Related framework topics

- [Session management](https://shopify.dev/custom-storefronts/hydrogen/sessions)
- [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/configuration)
