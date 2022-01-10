import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {
  mountWithShopifyProvider,
  getShopifyConfig,
} from '../../../utilities/tests/shopifyMount';
import {UnitPrice} from '../../UnitPrice';
import {ProductProvider} from '../../ProductProvider/index';
import {SelectedVariantUnitPrice} from '../SelectedVariantUnitPrice.client';
import {setShopifyConfig} from '../../../foundation/useShop/use-shop';

setShopifyConfig(getShopifyConfig());

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
