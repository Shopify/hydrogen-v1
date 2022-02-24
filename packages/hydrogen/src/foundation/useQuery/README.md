<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/foundation/useQuery and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `useQuery` hook is a wrapper around Suspense calls and
global runtime's Cache if it exists.
It supports Suspense calls on the server and on the client.

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

| Key       | Required | Description                                                                                                                                        |
| --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cache`   | No       | An object describing the [cache policy](/custom-storefronts/hydrogen/framework/cache) for the request.                                             |
| `preload` | No       | Whether to preload the query. Defaults to `false`. Specify `true` to preload the query for the URL or `'*'` to preload the query for all requests. |

## Related hooks

- [`useShopQuery`](/api/hydrogen/hooks/global/useshopquery)
