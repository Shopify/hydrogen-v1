<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/AddToCartButton and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `AddToCartButton` component renders a button that adds an item to the cart when pressed.
It must be a descendent of the `CartProvider` component.

## Example code

```tsx
import {
  CartProvider,
  CartUIProvider,
  CartContainer,
  AddToCartButton,
} from '@shopify/hydrogen';

export function MyComponent() {
  // ...

  return (
    <CartProvider>
      <CartUIProvider>
        <AddToCartButton
          variantId="1234"
          quantity={1}
          attributes={[{key: 'Engraving', value: 'Hello world'}]}
          accessibleAddingToCartLabel="Adding item to your cart"
        >
          Add to Cart
        </AddToCartButton>
        <CartContainer>{/* Your cart container JSX */}</CartContainer>
      </CartUIProvider>
    </CartProvider>
  );
}
```

## Props

| Name                         | Type                                                                 | Description                                                                                                                                                   |
| ---------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| attributes?                  | <code>Unknown<<wbr>UndocumentedType, UndocumentedType<wbr>>[]</code> | An array of cart line attributes that belong to the item being added to the cart.                                                                             |
| variantId                    | <code>string</code>                                                  | The ID of the variant.                                                                                                                                        |
| quantity?                    | <code>number</code>                                                  | The item quantity.                                                                                                                                            |
| children                     | <code>ReactNode</code>                                               | Any ReactNode elements.                                                                                                                                       |
| accessibleAddingToCartLabel? | <code>string</code>                                                  | The text that is announced by the screen reader when the item is being added to the cart. Used for accessibility purposes only and not displayed on the page. |

## Component type

The `AddToCartButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Used by

- [`SelectedVariantAddToCartButton`](/api/hydrogen/components/product-variant/selectedvariantaddtocartbutton)
