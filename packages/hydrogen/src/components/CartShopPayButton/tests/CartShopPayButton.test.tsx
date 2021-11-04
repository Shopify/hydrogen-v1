import React from 'react';
import {CartShopPayButton} from '../CartShopPayButton.client';
import {CartProvider} from '../../CartProvider';
import {SHOPIFY_CONFIG} from '../../../foundation/ShopifyProvider/tests/fixtures';
import {CART_WITH_LINES} from '../../CartProvider/tests/fixtures';
import {ShopPayButton} from '../../ShopPayButton';
import {ShopifyProvider} from '../../../foundation';
import {mountWithShopifyProvider} from '../../../utilities/tests/shopify_provider';

describe('CartShopPayButton', () => {
  it('renders a ShopPayButton', () => {
    const wrapper = mountWithShopifyProvider(
      <ShopifyProvider shopifyConfig={SHOPIFY_CONFIG}>
        <CartProvider cart={CART_WITH_LINES}>
          <CartShopPayButton />
        </CartProvider>
      </ShopifyProvider>
    );

    expect(wrapper).toContainReactComponent(ShopPayButton, {
      variantIds: [CART_WITH_LINES.lines.edges[0].node.merchandise.id],
    });
  });
});
