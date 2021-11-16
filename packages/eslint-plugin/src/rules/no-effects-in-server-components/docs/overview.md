# Prevents `useEffect` and `useLayoutEffect` in React Server Components (`hydrogen/no-effects-in-server-components`)

The `useEffect` and `useLayoutEffect` lifecycle hooks do not function as expected in React Server Components because Server Components execute only once per request on the server.
