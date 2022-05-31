---
gid: 232fa7f6-5c17-4659-b8c8-4466be88d602
title: isBrowser
description: The isBrowser utility is a function that returns a boolean indicating if the code was run on the client.
---

The `isBrowser` utility is a function that returns a boolean indicating if the code was run in the browser. This is useful because client components are still server rendered. Use the `isBrowser` hook if you don't want logic within your client component to be rendered on the server.

## Example code

```tsx
import {isBrowser} from '@shopify/hydrogen';

export function MyComponent() {
  if (isBrowser()) {
    return <p>I ran on the client</p>;
  }

  return <p>I ran on the server</p>;
}
```

## Arguments

None

## Return type

A Boolean indicating if the code was run on the client.

## Related utilities

- [`isServer`](api/hydrogen/utilities/isserver)
