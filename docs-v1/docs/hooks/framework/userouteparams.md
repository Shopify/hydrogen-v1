# useRouteParams


The `useRouteParams` hook retrieves the parameters of an active route. The hook is available in both server and client components. For example, if your file route has the name `[handle].server.jsx`, then `useRouteParams` returns an object with a key `handle` inside it.

## Example code

```jsx title="[handle].server.jsx"
import {useRouteParams} from '@shopify/hydrogen';
// Server component
export default function Page() {
  const {handle} = useRouteParams();
  return <h1>The handle route param is: {handle}</h1>;
}
```



```jsx title="component.client.jsx"
import {useRouteParams} from '@shopify/hydrogen';
// Client component
export default function Component() {
  const {handle} = useRouteParams();
  return <h1>The handle route param is: {handle}</h1>;
}
```



## Return value

The `useRouteParams` hook returns an object with key values for each matching route parameter.

## Related components

- [`Router`](/components/framework/router/)
- [`FileRoutes`](/components/framework/fileroutes/)
- [`Route`](/components/framework/route/)
- [`Link`](/components/framework/link/)

## Related hooks

- [`useNavigate`](/hooks/framework/usenavigate/)

## Related framework topics

- [Routes](https://shopify.dev/custom-storefronts/hydrogen/routing)
