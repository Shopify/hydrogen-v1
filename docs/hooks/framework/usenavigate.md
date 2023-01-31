# useNavigate


The `useNavigate` hook imperatively navigates between routes.

## Example code

{% codeblock file, filename: 'component.client.jsx' %}

```jsx
import {useNavigate} from '@shopify/hydrogen';

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

## Return value

The `useNavigate` hook returns a function which accepts the following values:

| Name    | Description                                                                                                                                                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| path    | The path you want to navigate to.                                                                                                                                                                                            |
| options | The options for the configuration object: `replace`, `reloadDocument`, `clientState`, `scroll`. For more information on the options, refer to the [Link component](/docs/components/framework/link). |

## Considerations

- Consider using the `useNavigate` hook only where appropriate. Generally, you should use the [`Link`](/docs/components/framework/link) component instead, because it provides standard browser accessibility functionality, like `cmd+click` and right-click to open.
- The `useNavigate` hook is only available in client components.

## Related components

- [`Link`](/docs/components/framework/link)

## Related framework topics

- [Routes](https://shopify.dev/custom-storefronts/hydrogen/routing)
