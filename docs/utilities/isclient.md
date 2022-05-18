---
gid: 232fa7f6-5c17-4659-b8c8-4466be88d602
title: isClient
description: The isClient utility is a function that returns a boolean indicating if the code was run on the client.
---

The `isClient` utility is a function that returns a boolean indicating
if the code was run on the client.

## Example code

```tsx
import {isClient} from '@shopify/hydrogen';

export function MyComponent() {
  if (isClient()) {
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
