import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {mountWithShopifyProvider} from '../../../utilities/tests/shopify_provider';
import {ProductProvider} from '../../ProductProvider';
import {RawHtml} from '../../RawHtml';
import {ProductDescription} from '../ProductDescription.client';

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
