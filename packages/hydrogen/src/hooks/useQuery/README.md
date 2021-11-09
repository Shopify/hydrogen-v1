<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/hooks/useProductOptions and run 'yarn generate-docs' at the root of this repo. -->

The `useQuery` hook is a wrapper around `useQuery` from `react-query`. It supports Suspense calls on the server and on the client.

## Example code

```jsx
const {data, error} = useQuery(['unique', 'key'], async () => {
  const response = await fetch('https://my.api.com/data.json', {
    headers: {
      accept: 'application/json',
    },
  });

  return await response.json();
});

return <h1>{data.title}</h1>;
```

## Arguments

The `useQuery` hook takes the following arguments:

| Key        | Required | Description                                          |
| ---------- | -------- | ---------------------------------------------------- |
| `cacheKey` | Yes      | A string or an array to uniquely identify the query. |
| `queryFn`  | Yes      | An asynchronous function that returns data.          |
| `options`  | No       | An object describing the options for the request.    |

The `options` object accepts the following properties:

| Key     | Required | Description                                                                             |
| ------- | -------- | --------------------------------------------------------------------------------------- |
| `cache` | No       | An object describing the [cache policy](/api/hydrogen/framework/cache) for the request. |

## Related hooks

- [`useShopQuery`](/api/hydrogen/hooks/global/useshopquery)
