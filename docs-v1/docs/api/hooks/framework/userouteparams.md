# useRouteParams


The `useRouteParams` hook retrieves the parameters of an active route. The hook is available in both server and client components. For example, if your file route has the name `[handle].server.jsx`, then `useRouteParams` returns an object with a key `handle` inside it.

## Example code

{% codeblock file, filename: '[handle].server.jsx' %}

```jsx
import {useRouteParams} from '@shopify/hydrogen';
// Server component
export default function Page() {
  const {handle} = useRouteParams();
  return <h1>The handle route param is: {handle}</h1>;
}
```

{% endcodeblock %}

{% codeblock file, filename: 'component.client.jsx' %}

```jsx
import {useRouteParams} from '@shopify/hydrogen';
// Client component
export default function Component() {
  const {handle} = useRouteParams();
  return <h1>The handle route param is: {handle}</h1>;
}
```

{% endcodeblock %}

## Return value

The `useRouteParams` hook returns an object with key values for each matching route parameter.

## Related components

- [`Router`](/docs/components/framework/router.md)
- [`FileRoutes`](/docs/components/framework/fileroutes.md)
- [`Route`](/docs/components/framework/route.md)
- [`Link`](/docs/components/framework/link.md)

## Related hooks

- [`useNavigate`](/docs/hooks/framework/usenavigate.md)

## Related framework topics

- [Routes](https://shopify.dev/custom-storefronts/hydrogen/routing)
