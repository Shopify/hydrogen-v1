import React from 'react';
import {render, screen} from '@testing-library/react';
import {CurrencyCode} from '../../../storefront-api-types.js';
import {getPrice} from '../../../utilities/tests/price.js';
import {getUnitPriceMeasurement} from '../../../utilities/tests/unitPriceMeasurement.js';
import {Money} from '../Money.client.js';
import {Link} from '../../Link/Link.client.js';
import {ShopifyTestProviders} from '../../../utilities/tests/provider-helpers.js';

describe('<Money />', () => {
  it('renders a formatted money string', () => {
    const money = getPrice({currencyCode: CurrencyCode.Usd});
    render(<Money data={money} />, {wrapper: ShopifyTestProviders});

    expect(screen.getByText(`$${money.amount}`)).toBeInTheDocument();
  });

  it('handles different currency codes', () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
    });
    render(<Money data={money} />, {wrapper: ShopifyTestProviders});

    expect(screen.getByText(money.amount, {exact: false})).toBeInTheDocument();
  });

  it('allows pass-through props to the wrapping component', () => {
    const money = getPrice();
    render(<Money data={money} className="money" />, {
      wrapper: ShopifyTestProviders,
    });

    expect(screen.getByText(money.amount, {exact: false})).toHaveClass('money');
  });

  it(`validates props when a component is passed to the 'as' prop`, () => {
    const money = getPrice();
    render(<Money data={money} as={Link} to="/test" />, {
      wrapper: ShopifyTestProviders,
    });

    const element = screen.getByRole('link', {
      name: new RegExp(money.amount),
    });

    expect(element).toHaveAttribute('href', '/test');
  });

  it(`removes trailing zeros when the prop is passed`, () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
      amount: '19.00',
    });
    render(<Money data={money} withoutTrailingZeros />, {
      wrapper: ShopifyTestProviders,
    });

    expect(screen.queryByText(`€${money.amount}`)).not.toBeInTheDocument();
    expect(screen.getByText(`€${19}`)).toBeInTheDocument();
  });

  it(`removes the currency symbol when the prop is passed`, () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
    });
    render(<Money data={money} withoutCurrency />, {
      wrapper: ShopifyTestProviders,
    });

    expect(screen.queryByText(`€${money.amount}`)).not.toBeInTheDocument();
    expect(screen.getByText(money.amount)).toBeInTheDocument();
  });

  it(`removes the currency symbol and trailing zeros when the props are both passed`, () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
      amount: '19.00',
    });
    render(<Money data={money} withoutCurrency withoutTrailingZeros />, {
      wrapper: ShopifyTestProviders,
    });

    expect(screen.queryByText(`€${money.amount}`)).not.toBeInTheDocument();
    expect(screen.queryByText(money.amount)).not.toBeInTheDocument();
    expect(screen.getByText('19')).toBeInTheDocument();
  });

  it(`allows a 'measurement' prop`, () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
      amount: '19.00',
    });

    const measurement = getUnitPriceMeasurement();
    render(<Money data={money} measurement={measurement} />, {
      wrapper: ShopifyTestProviders,
    });

    expect(
      screen.getByText(`/${measurement.referenceUnit}`, {exact: false})
    ).toBeInTheDocument();
  });

  it(`allows a 'measurement' prop with 'measurementSeparator' as a component`, () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
      amount: '19.00',
    });

    const measurement = getUnitPriceMeasurement();
    const MeasurementSeparator = () => <br />;

    const {container} = render(
      <Money
        data={money}
        measurement={measurement}
        measurementSeparator={<MeasurementSeparator />}
      />,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(container.querySelector('br')).toBeInTheDocument();
    expect(
      screen.getByText(measurement.referenceUnit, {exact: false})
    ).toBeInTheDocument();
  });

  it(`allows a 'measurement' prop with 'measurementSeparator' as a string`, () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
      amount: '19.00',
    });

    const measurement = getUnitPriceMeasurement();
    const MeasurementSeparator = '-';

    render(
      <Money
        data={money}
        measurement={measurement}
        measurementSeparator={MeasurementSeparator}
      />,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(
      screen.getByText(`${MeasurementSeparator}${measurement.referenceUnit}`, {
        exact: false,
      })
    ).toBeInTheDocument();
  });
});
