import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {
  mountWithShopifyProvider,
  getShopifyConfig,
} from '../../../utilities/tests/shopifyMount';
import {ProductProvider} from '../../ProductProvider';
import {RawHtml} from '../../RawHtml';
import {ProductDescription} from '../ProductDescription.client';
import {setShopifyConfig} from '../../../foundation/useShop/use-shop';

setShopifyConfig(getShopifyConfig());

describe('<ProductDescription/>', () => {
  it('renders <RawHtml /> with the product’s descriptionHtml', () => {
    const product = getProduct();
    const price = mountWithShopifyProvider(
      <ProductProvider product={product} initialVariantId="">
        <ProductDescription />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(RawHtml, {
      string: product.descriptionHtml,
    });
  });
});
