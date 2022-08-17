---
gid: 61a65cab-2745-412a-91ab-ab15b15424z5
title: fetchSync
description: The fetchSync hook makes API requests and is the recommended way to make simple fetch calls on the server and on the client.
---

The `fetchSync` hook makes API requests and is the recommended way to make simple fetch calls on the server and on the client. It's designed similar to the [Web API's `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch), only in a way that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html).

## Example code

{% codeblock file, filename: "MyComponent.server.js" %}

```jsx
import {fetchSync} from '@shopify/hydrogen';
import {Suspense} from 'react';
// Use `Suspense` boundaries to define where you want your app to display a loading indicator while your data is being accessed.
export function MyComponent() {
  return (
    <Suspense fallback="Loading...">
      <MyThings />
    </Suspense>
  );
}
function MyThings() {
  // To request data from a third-party API, pass the URL to `fetchSync` along with any arguments.
  const things = fetchSync('https://3p.api.com/things.json', {
    method: 'post',
  }).json();
  return <h2>{things.title}</h2>;
}
```

{% endcodeblock %}

## `fetchSync` in server components

If you're using `fetchSync` in a server component, then you provide options for caching and preloading. This is similar to the [`useQuery`](https://shopify.dev/api/hydrogen/hooks/global/usequery) hook:

{% codeblock file, filename: "MyComponent.server.js" %}

```jsx
import {fetchSync, CacheLong} from '@shopify/hydrogen';
import {Suspense} from 'react';
export function MyComponent() {
  return (
    <Suspense fallback="Loading...">
      <MyThings />
    </Suspense>
  );
}
function MyThings() {
  const things = fetchSync('https://3p.api.com/things.json', {
    preload: true,
    cache: CacheLong(),
  }).json();
  return <h2>{things.title}</h2>;
}
```

{% endcodeblock %}

### Arguments

The `fetchSync` hook takes the following arguments:

| Key           | Required | Description                                                                 |
| ------------- | -------- | --------------------------------------------------------------------------- |
| `string`      | Yes      | A URL to fetch.                                                             |
| `requestInit` | No       | The options to manage the fetch behavior and cache behavior of the request. |

The `requestInit` object augments the [`init` properties available in the Web Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) to include the following additional properties:

| Key                   | Required | Description                                                                                                                                                                                                                                    |
| --------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cache`               | No       | The [caching strategy](https://shopify.dev/custom-storefronts/hydrogen/framework/cache#caching-strategies) to help you determine which cache control header to set.                                                                            |
| `preload`             | No       | Whether to [preload the request](https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries). It defaults to true only when the `CachingStrategy` is not `CacheNone`. Specify `false` to disable or use `'*'` to preload the query for all requests. |
| `shouldCacheResponse` | No       | A function that inspects the response body to determine if it should be cached.                                                                                                                                                                |

### Return value

The `fetchSync` function returns a [Response object and its properties](https://developer.mozilla.org/en-US/docs/Web/API/Response). However, the following properties are adapted to work with React Suspense:

| Key        | Description                                                                               |
| ---------- | ----------------------------------------------------------------------------------------- |
| `json()`   | A function to synchronously return a JavaScript object based on the JSON response body.   |
| `text()`   | A function to synchronously return a string version of the response body.                 |

## `fetchSync` in client components

If you're using `fetchSync` in a client component, then you can't provide options for caching and preloading in client components:

{% codeblock file, filename: "MyComponent.client.js" %}

```jsx
import {fetchSync} from '@shopify/hydrogen';
import {Suspense} from 'react';
export function MyComponent() {
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

{% endcodeblock %}

### Arguments

The `fetchSync` hook takes the following arguments:

| Key           | Required | Description                                              |
| ------------- | -------- | -------------------------------------------------------- |
| `string`      | Yes      | A URL to fetch.                                          |
| `requestInit` | No       | The options to manage the fetch behavior of the request. |

The `requestInit` object mirrors the [`init` properties available in the Web Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request).

### Return value

The `fetchSync` function returns a [Response object and its properties](https://developer.mozilla.org/en-US/docs/Web/API/Response). However, the following properties are adapted to work with React Suspense:

| Key        | Description                                                                             |
| ---------- | --------------------------------------------------------------------------------------- |
| `json()`   | A function to synchronously return a JavaScript object based on the JSON response body. |
| `text()`   | A function to synchronously return a string version of the response body.               |

## Considerations

The following considerations apply to `fetchSync` in server and client components.

### `fetchSync` in server components

- Don't use `async/await` with the `fetchSync` helper provided by Hydrogen. Hydrogen wraps the native fetch call in a way that supports Suspense boundaries.
- Process the response contents with `json()` or `text()` helpers.

### `fetchSync` in client components

- Suspense boundaries in client components are rendered during server-side rendering (SSR). This means the fallback is streamed to the client while the fetch call runs.
- Data fetched on the server during SSR isn't serialized to the client. This means that your client `fetchSync` function will run twice during initial page load: once on the server and once on the client.
- Suspense boundaries inside client components rendered during a subsequent navigation are only rendered on the client - not on the server.
- If you include browser-only logic inside your client component Suspense boundary, which would otherwise fail on the server, then you should conditionally include the suspending component with a piece of client state activated by `useEffect` or with a user action: `{isLoaded && <Suspense><MyComponent></Suspense>}`.

## Related hooks

- [`useShopQuery`](https://shopify.dev/api/hydrogen/hooks/global/useshopquery)
- [`useQuery`](https://shopify.dev/api/hydrogen/hooks/global/usequery)

## Related framework topics

- [Caching](https://shopify.dev/custom-storefronts/hydrogen/framework/cache)
- [Preloaded queries](https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries)
- [Routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes)
- [Working with React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/work-with-rsc)
