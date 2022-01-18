import React from 'react';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {getProduct} from '../../../utilities/tests/product';
import {ProductProvider} from '../../ProductProvider';
import {SelectedVariantBuyNowButton} from '../SelectedVariantBuyNowButton';
import {CartProvider} from '../../CartProvider';
import {BuyNowButton} from '../../BuyNowButton';

/**
 * The `SelectedVariantBuyNowButton` component renders a `BuyNowButton` for the product's selected variant. Clicking this button automatically adds the selected variant to the cart and redirect the customer to checkout.
 */
describe('<SelectedVariantBuyNowButton />', () => {
  it('renders the default <BuyNowButton /> for the selected variant', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;

    const button = mountWithProviders(
      <CartProvider>
        <ProductProvider
          product={product}
          initialVariantId={selectedVariant.id}
        >
          <SelectedVariantBuyNowButton>Add to cart</SelectedVariantBuyNowButton>
        </ProductProvider>
      </CartProvider>
    );

    expect(button).toContainReactComponent(BuyNowButton, {
      variantId: selectedVariant.id,
      quantity: 1,
      disabled: undefined,
      attributes: undefined,
    });
  });

  it('renders the <BuyNowButton /> with a custom quantity when the `quantity` prop is provided', () => {
    const button = mountWithProviders(
      <CartProvider>
        <ProductProvider product={getProduct()} initialVariantId="">
          <SelectedVariantBuyNowButton quantity={10}>
            Add to cart
          </SelectedVariantBuyNowButton>
        </ProductProvider>
      </CartProvider>
    );

    expect(button).toContainReactComponent(BuyNowButton, {
      quantity: 10,
    });
  });

  it('renders a disabled <BuyNowButton /> when there is no selected variant', () => {
    const button = mountWithProviders(
      <CartProvider>
        <ProductProvider product={getProduct()} initialVariantId="">
          <SelectedVariantBuyNowButton>Add to cart</SelectedVariantBuyNowButton>
        </ProductProvider>
      </CartProvider>
    );

    expect(button).toContainReactComponent(BuyNowButton, {
      variantId: '',
      disabled: true,
    });
  });

  it('renders the <BuyNowButton /> with attributes when the `attributes` prop is provided', () => {
    const attributes = [{key: 'hello', value: 'world'}];
    const button = mountWithProviders(
      <CartProvider>
        <ProductProvider product={getProduct()} initialVariantId="">
          <SelectedVariantBuyNowButton attributes={attributes}>
            Add to cart
          </SelectedVariantBuyNowButton>
        </ProductProvider>
      </CartProvider>
    );

    expect(button).toContainReactComponent(BuyNowButton, {
      attributes,
    });
  });
});
