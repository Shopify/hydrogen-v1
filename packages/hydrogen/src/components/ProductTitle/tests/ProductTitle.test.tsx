import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {
  mountWithShopifyProvider,
  getShopifyConfig,
} from '../../../utilities/tests/shopifyMount';
import {ProductProvider} from '../../ProductProvider';
import {ProductTitle} from '../ProductTitle.client';
import {setShopifyConfig} from '../../../foundation/useShop/use-shop';

setShopifyConfig(getShopifyConfig());

describe('<ProductTitle />', () => {
  it('renders the product title in a <span> by default', () => {
    const product = getProduct();
    const price = mountWithShopifyProvider(
      <ProductProvider product={product} initialVariantId="">
        <ProductTitle />
      </ProductProvider>
    );

    expect(price).toContainReactComponent('span', {
      children: product.title,
    });
  });

  it('renders the product title in the HTML element specified by the `as` prop', () => {
    const product = getProduct();
    const price = mountWithShopifyProvider(
      <ProductProvider product={product} initialVariantId="">
        <ProductTitle as="p" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent('p', {
      children: product.title,
    });
  });
});
