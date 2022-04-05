# Prevent `useQuery` in client components

The `useQuery` hook doesn’t function in client components because it requires access to server-only features that don’t exist in the client.

## Rule details

This rule prevents using the `useQuery` hook in files that end with the `.client` extension.

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
