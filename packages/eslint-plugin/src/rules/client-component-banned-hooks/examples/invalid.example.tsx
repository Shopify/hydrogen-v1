// Incorrect code

// MyComponent.client.jsx
import {useQuery} from '@shopify/hydrogen';

export function AClientComponent() {
  const {data} = useQuery(/*...*/);
  return null;
}
