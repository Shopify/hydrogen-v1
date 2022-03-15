<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/utilities/isClient and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `isClient` utility is a function that returns a boolean indicating
if the code was run on the client.

## Example code

```tsx
import {isClient} from '@shopify/hydrogen/client';

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
