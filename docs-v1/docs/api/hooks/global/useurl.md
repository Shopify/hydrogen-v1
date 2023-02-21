# useUrl


The `useUrl` hook retrieves the current URL in a server or client component.

## Example code

```tsx
import {useUrl} from '@shopify/hydrogen';

export default function Page() {
  const url = useUrl();

  return <h1>Current Url is: {url.href}</h1>;
}
```

### Subscribing to the current URL value

In client components, you can subscribe to the current value of the URL:

```tsx
import {useUrl} from '@shopify/hydrogen';
import {useEffect} from 'react';

export function MyClientComponent() {
  const url = useUrl();

  useEffect(() => {
    // Do something with url
  }, [url]);

  // ...
}
```

The value of the URL will change immediately, but the page transition might not yet be completed. If you want to wait until the page is completely transitioned, then use the `pending` server state hook value:

```tsx
import {useUrl, useServerProps} from '@shopify/hydrogen';
import {useEffect} from 'react';

export function MyClientComponent() {
  const url = useUrl();
  const {pending} = useServerProps();

  useEffect(() => {
    if (!pending) {
      // Do something with url, now that the page transition has completed.
    }
  }, [url, pending]);

  // ...
}
```

## Return value

The `useUrl` hook returns a [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object with the current URL.
