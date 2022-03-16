---
'eslint-plugin-hydrogen': minor
---

Breaking Change: New rules `client-component-banned-hooks` and `server-component-banned-hooks` added as generic rules to ban any non-supported hooks in each context. `server-component-banned-hooks` combines and replaces the `no-state-in-server-components` and `no-effects-in-server-components` rules. `client-component-banned-hooks` will flag usage of `useQuery` and `useShopQuery` in client components.
