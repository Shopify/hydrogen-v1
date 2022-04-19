# Prevent `useState`, `useReducer`, `useEffect`, and `useLayoutEffect` in server and shared components

These state handling hooks don't function as expected in React Server Components because server components execute only once for each request on the server.
