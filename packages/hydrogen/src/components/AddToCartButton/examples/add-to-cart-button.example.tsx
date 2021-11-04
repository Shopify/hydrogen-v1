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
