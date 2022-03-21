<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/Image and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

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
import {useRouteParams} from '@shopify/hydrogen/client';
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

- [`Router`](/api/hydrogen/components/framework/router)
- [`FileRoutes`](/api/hydrogen/components/framework/fileroutes)
- [`Route`](/api/hydrogen/components/framework/route)
- [`Link`](/api/hydrogen/components/framework/link)

## Related hooks

- [`useNavigate`](/api/hydrogen/hooks/framework/usenavigate)
