---
gid: a84d7f1f-c1f4-419c-badc-a79835b39c88
title: useRouteParams
description: The useRouteParams hook retrieves the parameters of an active route.
---

The `useRouteParams` hook retrieves the parameters of an active route. The hook is available in both server and client components.

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

- [`Router`](https://shopify.dev/api/hydrogen/components/framework/router)
- [`FileRoutes`](https://shopify.dev/api/hydrogen/components/framework/fileroutes)
- [`Route`](https://shopify.dev/api/hydrogen/components/framework/route)
- [`Link`](https://shopify.dev/api/hydrogen/components/framework/link)

## Related hooks

- [`useNavigate`](https://shopify.dev/api/hydrogen/hooks/framework/usenavigate)

## Related framework topics

- [Routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes)
