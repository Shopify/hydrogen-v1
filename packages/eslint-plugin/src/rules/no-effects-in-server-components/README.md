# Prevents `useEffect` and `useLayoutEffect` in React Server Components (`hydrogen/no-effects-in-server-components`)

The `useEffect` and `useLayoutEffect` lifecycle hooks do not function as expected in React Server Components because Server Components execute only once per request on the server.

## Rule Details

This rule prevents using these hooks in files that do not end with the `.client` suffix.

```tsx
// Examples of **incorrect** code for this rule:

// MyComponent.jsx or MyComponent.server.jsx
import {useEffect} from 'react';

function MyNonClientComponent() {
  useEffect(() => {
    // code inside this useEffect will not execute as expected
  });

  return null;
}
```

```tsx
// Examples of **correct** code for this rule:

// MyClientComponent.client.jsx
import {useEffect} from 'react';

function MyClientComponent() {
  useEffect(() => {
    // in client components, this code will execute as expected
  });
  return null;
}
```
