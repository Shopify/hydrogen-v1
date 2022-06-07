---
gid: 232fa7f6-5c17-4659-b8c8-4466be88d602
title: isBrowser
description: The isBrowser utility is a function that returns a Boolean that indicates whether the code was run in the browser.
---

The `isBrowser` utility is a function that returns a Boolean that indicates whether the code was run in the browser. This information is useful because client components are server-rendered. Use the `isBrowser` utility if you don't want logic within your client component to be rendered on the server.

## Example code

```tsx
import {isBrowser} from '@shopify/hydrogen';

export function MyComponent() {
  if (isBrowser()) {
    return <p>I ran in the browser</p>;
  }

  return <p>I ran on the server</p>;
}
```

## Arguments

None

## Return type

A Boolean indicating whether the code was run in the browser.

## Related utilities

- [`isServer`](https://shopify.dev/api/hydrogen/utilities/isserver)
