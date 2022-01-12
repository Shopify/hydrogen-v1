import React from 'react';
import {
  mountWithProviders,
  getShopifyConfig,
} from '../../../utilities/tests/shopifyMount';
import {getProduct} from '../../../utilities/tests/product';
import {ProductProvider} from '../../ProductProvider';
import {SelectedVariantAddToCartButton} from '../SelectedVariantAddToCartButton.client';
import {CartProvider} from '../../CartProvider';
import {AddToCartButton} from '../../AddToCartButton';
import {setShopifyConfig} from '../../../foundation/useShop/use-shop';

setShopifyConfig(getShopifyConfig());

describe('<SelectedVariantAddToCartButton />', () => {
  it('renders the default <AddToCartButton /> for the selected variant', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;

    const button = mountWithProviders(
      <CartProvider>
        <ProductProvider
          product={product}
          initialVariantId={selectedVariant.id}
        >
          <SelectedVariantAddToCartButton>
            Add to cart
          </SelectedVariantAddToCartButton>
        </ProductProvider>
      </CartProvider>
    );

    expect(button).toContainReactComponent(AddToCartButton, {
      variantId: selectedVariant.id,
      quantity: 1,
      disabled: undefined,
      attributes: undefined,
    });
  });

  it('renders <AddToCartButton /> with a custom quantity when the `quantity` prop is provided', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;

    const button = mountWithProviders(
      <CartProvider>
        <ProductProvider
          product={product}
          initialVariantId={selectedVariant.id}
        >
          <SelectedVariantAddToCartButton quantity={5}>
            Add to cart
          </SelectedVariantAddToCartButton>
        </ProductProvider>
      </CartProvider>
    );

    expect(button).toContainReactComponent(AddToCartButton, {
      quantity: 5,
    });
  });

  it('renders a disabled <AddToCartButton /> when there is no selected variant', () => {
    const button = mountWithProviders(
      <CartProvider>
        <ProductProvider product={getProduct()} initialVariantId="">
          <SelectedVariantAddToCartButton>
            Add to cart
          </SelectedVariantAddToCartButton>
        </ProductProvider>
      </CartProvider>
    );

    expect(button).toContainReactComponent(AddToCartButton, {
      variantId: '',
      disabled: true,
    });
  });

  it('renders <AddToCartButton /> with attributes when the `attributes` prop is provided', () => {
    const attributes = [{key: 'hello', value: 'world'}];
    const button = mountWithProviders(
      <CartProvider>
        <ProductProvider product={getProduct()} initialVariantId="">
          <SelectedVariantAddToCartButton attributes={attributes}>
            Add to cart
          </SelectedVariantAddToCartButton>
        </ProductProvider>
      </CartProvider>
    );

    expect(button).toContainReactComponent(AddToCartButton, {
      attributes,
    });
  });
});
