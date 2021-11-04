import {isClient} from '@shopify/hydrogen/client';

export function MyComponent() {
  if (isClient()) {
    return <p>I ran on the client</p>;
  }

  return <p>I ran on the server</p>;
}
