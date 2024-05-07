# Configure user authentication


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::


Hydrogen includes built-in support for [managing user authentication](/tutorials/authentication/), including account creation, login, password reset, and logout. This guide describes additional configurations for user authentication.


## Retrieve a customer access token

You can retrieve a customer access token using the [`useSession`](/hooks/framework/usesession/) hook. If the `customerAccessToken` isn't defined, then the user isn't logged in.

```js
// component.server.jsx

const { customerAccessToken } = useSession()
```



## Tell bots not to index a page

Pages that require authentication shouldn't be indexed by bots. For example, bots shouldn't index login and account pages. You can tell bots to not index a page by passing `noindex` to the `Seo` component:

```jsx
// /account/login.server.jsx

<Seo type="noindex" data={{title: 'Login'}} />
```



## Related components and hooks

- [`Seo`](/components/primitive/seo/)
- [`useSession`](/hooks/framework/usesession/)
