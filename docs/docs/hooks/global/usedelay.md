# useDelay


The `useDelay` hook adds an artificial delay within your server components. This is useful to debug timing issues and to design fallback UI states at suspense boundaries.

> Note:
> All artificial delays are removed in production.

## Example code

```tsx
import {useShopQuery, gql, useDelay} from '@shopify/hydrogen';

export default function Page() {
  // Force `useShopQuery` to take at least 3 seconds
  const {data} = useDelay(
    useShopQuery({
      query: QUERY,
      variables: {},
    }),
    3000
  );

  // Add another delay. The component will not finish rendering
  // and be returned for another three seconds.
  useDelay('uniqueDelayKey', 3000);

  return <h1>{data.property}</h1>;
}

const QUERY = gql`/** add your query here **/`;
```

The `useDelay` hook is useful when testing suspense boundary fallbacks. The following is an example:

```tsx
import {useShopQuery, gql, useDelay} from '@shopify/hydrogen';

export default function Page() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <PageContent />
    </Suspense>
  );
}

function SkeletonPage() {
  return <div>Loading...</div>;
}

function PageContent() {
  const {data} = useDelay(
    useShopQuery({
      query: QUERY,
      variables: {},
    }),
    3000
  );

  return <div>...</div>;
}
```

## Arguments

The `useDelay` hook takes the following arguments:

| Key     | Required | Description                                                    |
| ------- | -------- | -------------------------------------------------------------- |
| `delay` | Yes      | A unique string or the result of either `useQuery` or `useShopQuery`. |
| `time`  | Yes      | The amount of time in milliseconds to delay.                    |

## Return value

The `useDelay` hook returns the result of either `useShopQuery` or `useQuery` after the specified delay.

## Related hooks

- [`useShopQuery`](/hooks/global/useshopquery/)
- [`useQuery`](/hooks/global/usequery/)
