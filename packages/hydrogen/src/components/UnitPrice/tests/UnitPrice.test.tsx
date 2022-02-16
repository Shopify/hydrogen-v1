import React from 'react';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {getUnitPriceMeasurement} from '../../../utilities/tests/unitPriceMeasurement';
import {getPrice} from '../../../utilities/tests/price';
import {UnitPrice} from '../UnitPrice.client';

const unitPrice = getPrice();
const unitPriceMeasurement = getUnitPriceMeasurement();

describe('<UnitPrice />', () => {
  it('renders unit price measurement for product in correct format', () => {
    const component = mountWithProviders(
      <UnitPrice data={unitPrice} measurement={unitPriceMeasurement} />
    );

    const expectedUnitPrice = `CA$${unitPrice.amount}/${unitPriceMeasurement.referenceUnit}`;
    expect(component).toContainReactText(expectedUnitPrice);
  });

  it('allows pass-through props to the wrapping component', () => {
    const component = mountWithProviders(
      <UnitPrice
        className="unitPriceMeasurement"
        data={unitPrice}
        measurement={unitPriceMeasurement}
      />
    );

    expect(component).toHaveReactProps({className: 'unitPriceMeasurement'});
  });
});
