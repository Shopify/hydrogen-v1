# isServer


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

A Boolean indicating if the code was run on the server.

## Related utilities

- [`isBrowser`](/utilities/isbrowser/)
