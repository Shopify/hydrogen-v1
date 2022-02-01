import React from 'react';
import {CartProvider} from '../../CartProvider';
import {getProduct} from '../../../utilities/tests/product';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {ProductProvider} from '../../ProductProvider';
import {ShopPayButton} from '../../ShopPayButton';
import {SelectedVariantShopPayButton} from '../SelectedVariantShopPayButton.client';

jest.mock('../../ShopPayButton', () => ({
  ShopPayButton() {
    return true;
  },
}));

describe('<SelectedVariantShopPayButton />', () => {
  it('renders <ShopPayButton /> for the selected variant', async () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;

    const button = await mountWithProviders(
      <CartProvider>
        <ProductProvider
          product={product}
          initialVariantId={selectedVariant.id}
        >
          <SelectedVariantShopPayButton />
        </ProductProvider>
      </CartProvider>
    );

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    button.act(() => {});

    expect(button).toContainReactComponent(ShopPayButton, {
      variantIds: [selectedVariant.id],
    });
  });
});
