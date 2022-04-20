---
'@shopify/hydrogen': minor
'create-hydrogen-app': minor
---

## Change from serverState to serverProps

**Breaking changes:**

1. `useServerState()` is gone. Use `useServerProps()` instead
2. `useServerProps()` is reset on each page navigation. Previously `useServerState()` was not.
3. `useServerProps()` does not contain `pathname` and `search`. Use the [useNavigate](https://shopify.dev/api/hydrogen/hooks/framework/usenavigate) hook to programmatically navigate instead.

**Explanation:**

The current behavior of server state is to **persist indefinitely** (until a hard page reload). This works great for things like the CountrySelector, where the updated state is meant to persist across navigations. This breaks down for many other use cases. Consider a collection paginator: if you paginate through to the second page of a collection using server state, visit a product page, and then go to a different collection page, the new collection page will use that same pagination variable in server state. This will result in a wonky or errored experience.

Additionally, we have found that the term for `serverState` is confusing. The hook is used within client components, yet the state is passed as a prop to server components.

As a result, `serverState` is now gone. Instead communicating between client and server components is through `serverProps`. If a client component wants to re-render server content, it just calls `setServerProps('some', 'data')`. Those props will be serialized to the server, and the server component will re-render. Additionally, the server props are reset on page navigation. So that they will not bleed between pages (fixes #331).

If you previously relied on `serverState` for global state in your app, you shouldn't use `serverProps` anymore. Instead we'll introduce a new session based mechanism for global state (in the meantime you could manually manage a cookie).

Lastly, `serverProps` no longer include the `pathname` and `search` parameters. Programmatically navigate in hydrogen instead with the [useNavigate](https://shopify.dev/api/hydrogen/hooks/framework/usenavigate) hook.
