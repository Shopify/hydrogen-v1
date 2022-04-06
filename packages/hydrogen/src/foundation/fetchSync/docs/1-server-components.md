## `fetchSync` in server components

If you're using `fetchSync` in a server component, then you provide options for caching and preloading. This is similar to the [`useQuery`](/api/hydrogen/hooks/global/useQuery) hook:

{% codeblock file, filename: "MyComponent.server.js" %}

```jsx
import {fetchSync, CacheMinutes} from '@shopify/hydrogen';
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
    cache: CacheMinutes(),
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

| Key                   | Required | Description                                                                                                                                                                                                      |
| --------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cache`               | No       | The [caching strategy](/custom-storefronts/hydrogen/framework/cache#caching-strategies) to help you determine which cache control header to set.                                                                 |
| `preload`             | No       | Whether to [preload the request](/custom-storefronts/hydrogen/framework/preloaded-queries). Defaults to `false`. Specify `true` to preload the query for the URL or `'*'` to preload the query for all requests. |
| `shouldCacheResponse` | No       | A function that inspects the response body to determine if it should be cached.                                                                                                                                  |

### Return value

The `fetchSync` function returns an object with the following keys:

| Key        | Description                                                                               |
| ---------- | ----------------------------------------------------------------------------------------- |
| `response` | The response returned by the fetch call. Useful for checking the status code and headers. |
| `json()`   | A function to return a JavaScript object based on the JSON response body.                 |
| `text()`   | A function to return a string version of the response body.                               |
