---
gid: dcb66133-905b-4574-b854-1de3f6230492
title: Cookie
description: The Cookie component helps you build your own custom cookie and session implementations.
---

The `Cookie` component helps you build your own custom cookie and session implementations. All [Hydrogen session storage mechanisms](https://shopify.dev/custom-storefronts/hydrogen/framework/sessions#types-of-session-storage) use the same configuration options as `Cookie`.

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

The following table describes the options for how the cookie is persisted within the browser. The properties are derived from the [cookie specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies):

| Option   | Type                                             | Description                                                                                                                                                                                               |
| -------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| expires  | <code>date</code>                                | [A date on which the cookie will expire](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_the_lifetime_of_a_cookie). If the date is in the past, then the browser will remove the cookie. |
| maxAge   | <code>number</code>                              | The [number of seconds until the cookie expires](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#max-agenumber). `maxAge` takes precedence over `expires` if both are defined.       |
| secure   | <code>boolean</code>                             | Whether to secure the cookie so that the browser only sends the cookie over HTTPS. Some browsers [don't work with secure cookies on localhost](https://owasp.org/www-community/controls/SecureCookieAttribute).                                                                                   |
| httpOnly | <code>boolean</code>                             | Whether to secure the cookie so that [client-side JavaScript can't read the cookie](https://owasp.org/www-community/HttpOnly).   |
| sameSite | <code>"lax" &#124; "strict" &#124; "none"</code> | Declares that the cookie should be restricted to a first-party or [same-site](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite) context.                                     |
| path     | <code>string</code>                              | Tells the browser that the cookie should only be sent to the server if it's within the [defined path](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#path_attribute).                          |
| domain   | <code>string</code>                              | Secures the cookie so that it's only used on [specific domains](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#domain_attribute).                                                              |

## Component type

The `Cookie` component is a server component. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`FileSessionStorage`](https://shopify.dev/api/hydrogen/components/framework/filesessionstorage)
- [`CookieSessionStorage`](https://shopify.dev/api/hydrogen/components/framework/cookiesessionstorage)
- [`MemorySessionStorage`](https://shopify.dev/api/hydrogen/components/framework/memorysessionstorage)

## Related hooks

- [`useSession`](https://shopify.dev/api/hydrogen/hooks/framework/usesession)

## Related framework topics

- [Session management](https://shopify.dev/custom-storefronts/hydrogen/framework/sessions)
- [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config)
