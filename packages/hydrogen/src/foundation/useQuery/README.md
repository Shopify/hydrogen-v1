<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/foundation/useQuery and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `useQuery` hook executes an asynchronous operation like `fetch` in a way that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html). It's based on [react-query](https://react-query.tanstack.com/reference/useQuery). You can use this hook to call any third-party APIs from a server component.

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

| Key                   | Required | Description                                                                                                                                                                                                    |
| --------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cache`               | No       | The [caching strategy](/custom-storefronts/hydrogen/framework/cache#caching-strategies) to help you determine which cache control header to set.                                                               |
| `preload`             | No       | Whether to [preload the query](/custom-storefronts/hydrogen/framework/preloaded-queries). Defaults to `false`. Specify `true` to preload the query for the URL or `'*'` to preload the query for all requests. |
| `shouldCacheResponse` | No       | A function that inspects the response body to determine if it should be cached.                                                                                                                                |

## Return value

The `useQuery` returns an object with the following key:

| Key    | Description                     |
| ------ | ------------------------------- |
| `data` | The data returned by the query. |

## Related hooks

- [`useShopQuery`](/api/hydrogen/hooks/global/useshopquery)
