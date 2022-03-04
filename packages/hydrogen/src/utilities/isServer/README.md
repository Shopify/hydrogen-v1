<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/utilities/isServer and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `isServer` utility is a function that returns a `boolean` indicating
if the code was run on the server.

## Example code

```tsx
import {isServer} from '@shopify/hydrogen';

export function MyComponent() {
  if (isServer()) {
    return <p>I ran on the server</p>;
  }

  return <p>I ran on the client</p>;
}
```

## Arguments

None

## Return type

A `boolean` indicating if the code was run on the server.

## Related utilities

- [`isClient`](api/hydrogen/utilities/isclient)
