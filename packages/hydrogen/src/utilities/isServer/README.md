<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/utilities/isServer and run 'yarn generate-docs' at the root of this repo. -->

The `isServer` utility is a function that returns a `boolean` indicating
if the code was run on the server.

## Arguments

None

## Return type

A `boolean` indicating if the code was run on the server.

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

## Related utilities

- [`isClient`](api/hydrogen/utilities/isclient)
