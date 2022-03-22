<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/foundation/useQuery and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `useNavigate` hook imperatively navigates between routes.

## Example code

{% codeblock file, filename: 'component.client.jsx' %}

```jsx
import {useNavigate} from '@shopify/hydrogen/client';

function addToCart() {}

export default function ClientComponent() {
  const navigate = useNavigate();
  async function clickAddToCart() {
    await addToCart();
    navigate('/success', {replace: true});
  }
  return <Button onClick={clickAddToCart}>Add to Cart</Button>;
}
```

{% endcodeblock %}

## Arguments

The `useNavigate` hook takes the following arguments:

| Argument        | Description                                                                                |
| --------------- | ------------------------------------------------------------------------------------------ |
| replace?        | Whether to update the state object or URL of the current history entry. Defaults to false. |
| reloadDocument? | Whether to reload the whole document on navigation.                                        |
| clientState?    | The custom client state with the navigation.                                               |

## Return value

The `useNavigate` hook returns the following values:

| Name    | Description                                                                                                                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| path    | The path you want to navigate to.                                                                                                                                                               |
| options | The options for the configuration object: `replace`, `reloadDocument`, `clientState`. For more information the options, refer to the [Link component](/api/hydrogen/components/framework/link). |

## Considerations

- Consider using the `useNavigate` hook only where appropriate. Generally, you should use the [`Link`](/api/hydrogen/components/framework/link) component instead, because it provides standard browser accessibility functionality, like `cmd+click` and right-click to open.
- The `useNavigate` hook is only available in client components.

## Related components

- [`Link`](/api/hydrogen/components/framework/link)

## Related hooks

- [`useNavigate`](/api/hydrogen/hooks/framework/userouteparams)
