# Prevents `useState` and `useReducer` in React Server Components (`hydrogen/no-state-in-server-components`)

The `useState` and `useReducer` state handling hooks do not function as expected in React Server Components because Server Components execute only once per request on the server.
