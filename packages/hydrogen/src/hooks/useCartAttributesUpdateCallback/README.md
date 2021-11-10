<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useCartAttributesUpdateCallback and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `useCartAttributesUpdateCallback` hook returns a callback that can be used to update the cart's attributes. It must be a descendent of a `CartProvider` component.

## Example code

```tsx
import {useCart, useCartAttributesUpdateCallback} from '@shopify/hydrogen';

export function CartAttributesUpdate() {
  const {attributes} = useCart();
  const cartAttributesUpdate = useCartAttributesUpdateCallback();
  const [cartAttributes, setCartAttributes] = useState([...attributes]);

  useEffect(() => {
    cartAttributesUpdate([
      {key: 'color', value: 'blue'},
      {key: 'message', value: 'hello world'},
    ]);
  }, []);

  useEffect(() => {
    setCartAttributes(attributes);
  }, [attributes]);

  return (
    <>
      {cartAttributes.map(({key, value}, index) => {
        return (
          <div key={key}>
            <p>{key}</p>
            <input
              data-cart-attribute
              value={value}
              type="text"
              onChange={(event) => {
                const localCopy = [...cartAttributes];
                localCopy[index] = {key, value: event.target.value};
                setCartAttributes(localCopy);
              }}
            />
          </div>
        );
      })}
      <button onClick={() => cartAttributesUpdate(cartAttributes)}>
        Update Attributes
      </button>
    </>
  );
}
```

## Return value

A callback to update the cart's attributes. The callback expects one argument corresponding to the value of the array of attributes.

## Related components

- [`CartProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
