import React from 'react';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';
import {CurrencyCode} from '../../../storefront-api-types.js';
import {getPrice} from '../../../utilities/tests/price.js';
import {getUnitPriceMeasurement} from '../../../utilities/tests/unitPriceMeasurement.js';
import {Money} from '../Money.client.jsx';
import {Link} from '../../Link/Link.client.jsx';

describe('<Money />', () => {
  it('renders a formatted money string', () => {
    const money = getPrice({currencyCode: CurrencyCode.Usd});
    const component = mountWithProviders(<Money data={money} />);

    expect(component).toContainReactText(`$${money.amount}`);
  });

  it('handles different currency codes', () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
    });
    const component = mountWithProviders(<Money data={money} />);

    expect(component).toContainReactText(`€${money.amount}`);
  });

  it('allows pass-through props to the wrapping component', () => {
    const component = mountWithProviders(
      <Money data={getPrice()} className="money" />
    );

    expect(component).toHaveReactProps({className: 'money'});
  });

  it(`validates props when a component is passed to the 'as' prop`, () => {
    const component = mountWithProviders(
      <Money data={getPrice()} as={Link} to="/test" />
    );

    expect(component).toContainReactComponent(Link, {to: '/test'});
  });

  it(`removes trailing zeros when the prop is passed`, () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
      amount: '19.00',
    });
    const component = mountWithProviders(
      <Money data={money} withoutTrailingZeros />
    );

    expect(component).not.toContainReactText(`€${money.amount}`);
    expect(component).toContainReactText(`€${19}`);
  });

  it(`removes the currency symbol when the prop is passed`, () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
    });
    const component = mountWithProviders(
      <Money data={money} withoutCurrency />
    );

    expect(component).not.toContainReactText(`€${money.amount}`);
    expect(component).toContainReactText(`${money.amount}`);
  });

  it(`removes the currency symbol and trailing zeros when the props are both passed`, () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
      amount: '19.00',
    });
    const component = mountWithProviders(
      <Money data={money} withoutCurrency withoutTrailingZeros />
    );

    expect(component).not.toContainReactText(`€${money.amount}`);
    expect(component).not.toContainReactText(`${money.amount}`);
    expect(component).toContainReactText(`19`);
  });

  it(`allows a 'measurement' prop`, () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
      amount: '19.00',
    });

    const measurement = getUnitPriceMeasurement();

    const component = mountWithProviders(
      <Money data={money} measurement={measurement} />
    );

    expect(component).toContainReactText(`/${measurement.referenceUnit}`);
  });

  it(`allows a 'measurement' prop with 'measurementSeparator' as a component`, () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
      amount: '19.00',
    });

    const measurement = getUnitPriceMeasurement();
    const MeasurementSeparator = () => <br />;

    const component = mountWithProviders(
      <Money
        data={money}
        measurement={measurement}
        measurementSeparator={<MeasurementSeparator />}
      />
    );

    expect(component).toContainReactComponent(MeasurementSeparator);
    expect(component).toContainReactText(`${measurement.referenceUnit}`);
  });

  it(`allows a 'measurement' prop with 'measurementSeparator' as a string`, () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
      amount: '19.00',
    });

    const measurement = getUnitPriceMeasurement();
    const MeasurementSeparator = '-';

    const component = mountWithProviders(
      <Money
        data={money}
        measurement={measurement}
        measurementSeparator={MeasurementSeparator}
      />
    );

    expect(component).toContainReactText(
      `${MeasurementSeparator}${measurement.referenceUnit}`
    );
  });
});
