import React from 'react';
import {
  mountWithShopifyProvider,
  getShopifyConfig,
} from '../../../utilities/tests/shopifyMount';
import {getUnitPriceMeasurement} from '../../../utilities/tests/unitPriceMeasurement';
import {getPrice} from '../../../utilities/tests/price';
import {UnitPrice} from '../UnitPrice.client';
import {setShopifyConfig} from '../../../foundation/useShop/use-shop';

setShopifyConfig(getShopifyConfig());

const unitPrice = getPrice();
const unitPriceMeasurement = getUnitPriceMeasurement();

describe('<UnitPrice />', () => {
  it('renders unit price measurement for product in correct format', () => {
    const component = mountWithShopifyProvider(
      <UnitPrice
        unitPrice={unitPrice}
        unitPriceMeasurement={unitPriceMeasurement}
      />
    );

    const expectedUnitPrice = `CA$${unitPrice.amount}/${unitPriceMeasurement.referenceUnit}`;
    expect(component).toContainReactText(expectedUnitPrice);
  });

  it('allows pass-through props to the wrapping component', () => {
    const component = mountWithShopifyProvider(
      <UnitPrice
        className="unitPriceMeasurement"
        unitPrice={unitPrice}
        unitPriceMeasurement={unitPriceMeasurement}
      />
    );

    expect(component).toHaveReactProps({className: 'unitPriceMeasurement'});
  });
});
