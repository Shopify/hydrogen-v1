The `useUrl` hook retrieves the current URL in a server or client component.

## Example code

```tsx
import {useUrl} from '@shopify/hydrogen';

export default function Page() {
  const url = useUrl();

  return <h1>Current Url is: {url.href}</h1>;
}
```

In client components, you can subscribe to the current value of the URL:

```jsx
import {useUrl} from '@shopify/hydrogen/client';
import {useEffect} from 'react';

export function MyClientComponent() {
  const url = useUrl();

  useEffect(() => {
    // do something with url
  }, [url]);

  // ...
}
```

It's important to note the value of the URL will change immediately, but the page transition may not yet be completed. If you want to wait until the page is completely transitioned, use the `pending` server state hook value:

```jsx
import {useUrl, useServerState} from '@shopify/hydrogen/client';
import {useEffect} from 'react';

export function MyClientComponent() {
  const url = useUrl();
  const {pending} = useServerState();

  useEffect(() => {
    if (!pending) {
      // do something with url, now that the page transition has completed.
    }
  }, [url, pending]);

  // ...
}
```

## Return value

The `useUrl` hook returns a [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object with the current URL.
