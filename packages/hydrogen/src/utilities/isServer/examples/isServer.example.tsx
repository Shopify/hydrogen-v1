import {isServer} from '@shopify/hydrogen';

export function MyComponent() {
  if (isServer()) {
    return <p>I ran on the server</p>;
  }

  return <p>I ran on the client</p>;
}
