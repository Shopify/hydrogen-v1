# Prevents `useState` and `useReducer` in React Server Components (`hydrogen/no-banned-hooks-in-server-components`)

The `useState` and `useReducer` state handling hooks do not function as expected in React Server Components because Server Components execute only once per request on the server.

## Rule Details

This rule prevents using these hooks in files that do not end with the `.client` suffix.

Examples of **incorrect** code for this rule:

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

Examples of **correct** code for this rule:

```tsx
// MyClientComponent.client.jsx

function MyClientComponent() {
  const [state, setState] = useState();
  return null;
}
```
