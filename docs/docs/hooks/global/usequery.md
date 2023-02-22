# useQuery


The `useQuery` hook executes an asynchronous operation like `fetch` in a way that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html). It's based on [react-query](https://react-query.tanstack.com/reference/useQuery). You can use this hook to call any third-party APIs from a server component.

> Note:
> If you're making a simple fetch call on the server, then we recommend using the [`fetchSync`](/hooks/global/fetchsync/) hook instead.

## Example code

```tsx
import {useQuery} from '@shopify/hydrogen';

export default function Page() {
  const {data} = useQuery(['unique', 'key'], async () => {
    const response = await fetch('https://my.api.com/data.json', {
      headers: {
        accept: 'application/json',
      },
    });

    return await response.json();
  });

  return <h1>{data.title}</h1>;
}
```

## Arguments

The `useQuery` hook takes the following arguments:

| Key            | Required | Description                                                     |
| -------------- | -------- | --------------------------------------------------------------- |
| `key`          | Yes      | A string or an array to uniquely identify the query.            |
| `queryFn`      | Yes      | An asynchronous query function like `fetch` which returns data. |
| `queryOptions` | No       | The options to manage the cache behavior of the sub-request.    |

The `queryOptions` object accepts the following properties:

| Key                   | Required | Description                                                                                                                                                                                                                                                         |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cache`               | No       | The [caching strategy](https://shopify.dev/custom-storefronts/hydrogen/querying/cache#caching-strategies) to help you determine which cache control header to set.                                                                                                 |
| `preload`             | No       | Whether to [preload the request](https://shopify.dev/custom-storefronts/hydrogen/querying/preloaded-queries). It defaults to true only when the `CachingStrategy` is not `CacheNone`. Specify `false` to disable or use `'*'` to preload the query for all requests. |
| `shouldCacheResponse` | No       | A function that inspects the response body to determine if it should be cached.                                                                                                                                                                                     |

## Return value

The `useQuery` returns an object with the following key:

| Key    | Description                     |
| ------ | ------------------------------- |
| `data` | The data returned by the query. |

## Related hooks

- [`fetchSync`](/hooks/global/fetchsync/)
- [`useShopQuery`](/hooks/global/useshopquery/)

## Related framework topics

- [Caching](https://shopify.dev/custom-storefronts/hydrogen/querying/cache)
- [Preloaded queries](https://shopify.dev/custom-storefronts/hydrogen/querying/preloaded-queries)
- [Routes](https://shopify.dev/custom-storefronts/hydrogen/routing)
- [Working with React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components/work-with-rsc)
