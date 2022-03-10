# Prevents `useState`, `useReducer`, `useEffect` and `useLayoutEffect` in React Server Components (`hydrogen/server-component-banned-hooks`)

The `useState`, `useReducer`, `useEffect` and `useLayoutEffect` hooks do not function as expected in React Server Components because Server Components execute only once per request on the server.
