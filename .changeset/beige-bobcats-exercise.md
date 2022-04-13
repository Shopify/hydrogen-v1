---
'@shopify/hydrogen': minor
---

Introduce Suspense-friendly `fetchSync` API for server and client components.

When using `fetchSync` in server components, you provide options for caching and preloading. This is similar to the [`useQuery` hook](<[/api/hydrogen/hooks/global/useQuery](https://shopify.dev/api/hydrogen/hooks/global/usequery)>):

```jsx
import {fetchSync, CacheMinutes} from '@shopify/hydrogen';
import {Suspense} from 'react';

export function MyServerComponent() {
  return (
    <Suspense fallback="Loading...">
      <MyThings />
    </Suspense>
  );
}

function MyThings() {
  const things = fetchSync('https://3p.api.com/things.json', {
    preload: true,
    cache: CacheMinutes(),
  }).json();

  return <h2>{things.title}</h2>;
}
```

When using `fetchSync` in client components, you cannot provide options for caching and preloading. You must import `fetchSync` from `@shopify/hydrogen/client`:

```jsx
import {fetchSync} from '@shopify/hydrogen/client';
import {Suspense} from 'react';

export function MyClientComponent() {
  return (
    <Suspense fallback="Loading...">
      <MyThings />
    </Suspense>
  );
}

function MyThings() {
  const things = fetchSync('https://3p.api.com/things.json').json();

  return <h2>{things.title}</h2>;
}
```
