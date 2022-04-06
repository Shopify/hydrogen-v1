---
'@shopify/hydrogen': minor
---

Introduce Suspense-friendly `fetch` API for server and client components.

When using `fetch` in server components, you provide options for caching and preloading. This is similar to the [`useQuery` hook](<[/api/hydrogen/hooks/global/useQuery](https://shopify.dev/api/hydrogen/hooks/global/usequery)>):

```jsx
import {fetch, CacheMinutes} from '@shopify/hydrogen';
import {Suspense} from 'react';

export function MyServerComponent() {
  return (
    <Suspense fallback="Loading...">
      <MyThings />
    </Suspense>
  );
}

function MyThings() {
  const things = fetch('https://3p.api.com/things.json', {
    preload: true,
    cache: CacheMinutes(),
  }).json();

  return <h2>{things.title}</h2>;
}
```

When using `fetch` in client components, you cannot provide options for caching and preloading. You must import `fetch` from `@shopify/hydrogen/client`:

```jsx
import {fetch} from '@shopify/hydrogen/client';
import {Suspense} from 'react';

export function MyClientComponent() {
  return (
    <Suspense fallback="Loading...">
      <MyThings />
    </Suspense>
  );
}

function MyThings() {
  const things = fetch('https://3p.api.com/things.json').json();

  return <h2>{things.title}</h2>;
}
```
