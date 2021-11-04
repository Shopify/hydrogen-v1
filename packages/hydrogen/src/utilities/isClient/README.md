<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/utilities/isClient and run 'yarn generate-docs' at the root of this repo. -->

The `isClient` utility is a function that returns a boolean indicating
if the code was run on the client.

## Arguments

None

## Return type

A `boolean` indicating if the code was run on the client.

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

## Related utilities

- [`isServer`](api/hydrogen/utilities/isserver)
