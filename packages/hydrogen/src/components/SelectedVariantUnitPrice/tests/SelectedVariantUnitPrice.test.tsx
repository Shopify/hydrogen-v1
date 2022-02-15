import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {UnitPrice} from '../../UnitPrice';
import {ProductProvider} from '../../ProductProvider/index';
import {SelectedVariantUnitPrice} from '../SelectedVariantUnitPrice.client';

describe('<SelectedVariantUnitPrice />', () => {
  it('renders <UnitPrice />', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;
    const component = mountWithProviders(
      <ProductProvider product={product} initialVariantId={selectedVariant.id}>
        <SelectedVariantUnitPrice />
      </ProductProvider>
    );

    expect(component).toContainReactComponent(UnitPrice, {
      data: selectedVariant.unitPrice,
      measurement: selectedVariant.unitPriceMeasurement,
    });
  });
});
