# Configure user authentication


> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.

Hydrogen includes built-in support for [managing user authentication](/docs/tutorials/authentication/index.md), including account creation, login, password reset, and logout. This guide describes additional configurations for user authentication.


## Retrieve a customer access token

You can retrieve a customer access token using the [`useSession`](/docs/hooks/framework/usesession.md) hook. If the `customerAccessToken` isn't defined, then the user isn't logged in.

```js
// component.server.jsx

const { customerAccessToken } = useSession()
```



## Tell bots not to index a page

Pages that require authentication shouldn't be indexed by bots. For example, bots shouldn't index login and account pages. You can tell bots to not index a page by passing `noindex` to the `Seo` component:

```jsx
// /account/login.server.jsx

<Seo type="noindex" data={% raw %}{{title: 'Login'}}{% endraw %} />
```



## Related components and hooks

- [`Seo`](/docs/components/primitive/seo.md)
- [`useSession`](/docs/hooks/framework/usesession.md)
