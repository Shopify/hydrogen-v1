<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/SelectedVariantAddToCartButton and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `SelectedVariantAddToCartButton` component renders a `AddToCartButton` for the product's
selected variant. Clicking this button automatically adds the selected variant to the cart.
It must be a descendent of a `ProductProvider` and `CartProvider` component.

## Example code

```tsx
import {
  SelectedVariantAddToCartButton,
  ProductProvider,
  useProduct,
} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider data={product}>
      <ProductOptions />
      <SelectedVariantAddToCartButton>
        Add to cart
      </SelectedVariantAddToCartButton>
    </ProductProvider>
  );
}

function ProductOptions() {
  const {options, setSelectedOption, selectedOptions} = useProduct();

  return options.map(({name, values}) => {
    return (
      <fieldset key={name}>
        <legend>{name}</legend>
        <div>
          {values.map((value) => {
            return (
              <label key={id} htmlFor={id}>
                <input
                  type="radio"
                  id={id}
                  name={`option-${name}`}
                  value={value}
                  checked={checked}
                  onChange={() => setSelectedOption(name, value)}
                />
                {value}
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  });
}
```

## Component type

The `SelectedVariantAddToCartButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`AddToCartButton`](/api/hydrogen/components/cart/addtocartbutton)
- [`ProductProvider`](/api/hydrogen/components/product-variant/productprovider)
- [`CartProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useProductOptions`](/api/hydrogen/hooks/product-variant/useproductoptions)
