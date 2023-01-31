# FileSessionStorage


The `FileSessionStorage` component persists session data to the file system.

## Example code

{% codeblock file, filename: 'hydrogen.config.js' %}

```jsx
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

{% endcodeblock %}

## Props

| Prop          | Type                       | Description                                                                                                                             |
| ------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| name          | <code>string</code>        | The name of the cookie stored in the browser.                                                                                           |
| dir           | <code>string</code>        | A directory to store the session files in. Each session is stored in a separate file on the file system.                                |
| cookieOptions | <code>CookieOptions</code> | An optional object to configure [how the cookie is persisted in the browser](/docs/components/framework/cookie#cookie-options). |

## Component type

The `FileSessionStorage` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Considerations

Because `FileSessionStorage` relies on the file system, it shouldn't be used in Edge workers, and instead only in NodeJS deployments.

## Related components

- [`Cookie`](https://shopify.dev/api/hydrogen/components/framework/cookie)
- [`MemorySessionStorage`](https://shopify.dev/api/hydrogen/components/framework/memorysessionstorage)
- [`CookieSessionStorage`](https://shopify.dev/api/hydrogen/components/framework/cookiesessionstorage)

## Related hooks

- [`useSession`](https://shopify.dev/api/hydrogen/hooks/framework/usesession)

## Related framework topics

- [Session management](https://shopify.dev/custom-storefronts/hydrogen/sessions)
- [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/configuration)
