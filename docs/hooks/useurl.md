The `useUrl` hook retrieves the current URL in a server or client component.

## Example code

```tsx
import {useUrl} from '@shopify/hydrogen';

export default function Page() {
  const url = useUrl();

  return <h1>Current Url is: {url.href}</h1>;
}
```

## Return value

The `useUrl` hook returns a [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object with the current URL.
