# Prevent `useState`, `useReducer`, `useEffect`, and `useLayoutEffect` in server and shared components

These state handling hooks don't function as expected in React Server Components because server components execute only once for each request on the server.

## Rule details

This rule prevents using the `useState`, `useReducer`, `useEffect`, and `useLayoutEffect` hooks in files that don't end with the `.client` extension.

### Incorrect code

```tsx
// MyServerComponent.server.jsx

function MyServerComponent() {
  const [state, setState] = useState();
  return null;
}
```

```tsx
// MyServerComponent.jsx

function MyServerComponent() {
  const [state, setState] = useState();
  return null;
}
```

### Correct code

```tsx
// MyClientComponent.client.jsx

function MyClientComponent() {
  const [state, setState] = useState();
  return null;
}
```
