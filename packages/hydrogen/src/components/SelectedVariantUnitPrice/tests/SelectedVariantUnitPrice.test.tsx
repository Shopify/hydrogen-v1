import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {mountWithShopifyProvider} from '../../../utilities/tests/shopify_provider';
import {UnitPrice} from '../../UnitPrice';
import {ProductProvider} from '../../ProductProvider';
import {SelectedVariantUnitPrice} from '../SelectedVariantUnitPrice.client';

describe('<SelectedVariantUnitPrice />', () => {
  it('renders <UnitPrice />', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;
    const component = mountWithShopifyProvider(
      <ProductProvider product={product} initialVariantId={selectedVariant.id}>
        <SelectedVariantUnitPrice />
      </ProductProvider>
    );

    expect(component).toContainReactComponent(UnitPrice, {
      unitPrice: selectedVariant.unitPrice,
      unitPriceMeasurement: selectedVariant.unitPriceMeasurement,
    });
  });
});
