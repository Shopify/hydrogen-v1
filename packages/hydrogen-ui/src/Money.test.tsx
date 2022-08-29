import React from 'react';
import {render, screen} from '@testing-library/react';
import {Money} from './Money.js';
import {ShopifyProvider} from './ShopifyProvider.js';
import {
  MoneyV2,
  UnitPriceMeasurement,
  UnitPriceMeasurementMeasuredUnit,
} from './storefront-api-types.js';
import {faker} from '@faker-js/faker';
import {getShopifyConfig} from './ShopifyProvider.test.js';

describe('<Money />', () => {
  it('renders a formatted money string', () => {
    const money = getPrice({currencyCode: 'USD'});
    render(<Money data={money} />, {
      wrapper: ({children}) => (
        <ShopifyProvider shopifyConfig={getShopifyConfig()}>
          {children}
        </ShopifyProvider>
      ),
    });

    expect(screen.getByText(`$${money.amount}`)).toBeInTheDocument();
  });

  it('handles different currency codes', () => {
    const money = getPrice({
      currencyCode: 'EUR',
    });
    render(<Money data={money} />, {
      wrapper: ({children}) => (
        <ShopifyProvider shopifyConfig={getShopifyConfig()}>
          {children}
        </ShopifyProvider>
      ),
    });

    expect(screen.getByText(money.amount, {exact: false})).toBeInTheDocument();
  });

  it('allows pass-through props to the wrapping component', () => {
    const money = getPrice();
    render(<Money data={money} className="money" />, {
      wrapper: ({children}) => (
        <ShopifyProvider shopifyConfig={getShopifyConfig()}>
          {children}
        </ShopifyProvider>
      ),
    });

    expect(screen.getByText(money.amount, {exact: false})).toHaveClass('money');
  });

  it.todo(`validates props when a component is passed to the 'as' prop`, () => {
    const money = getPrice();
    // @ts-expect-error figure out a better component to use here since Link won't be coming to h-ui
    render(<Money data={money} as={Link} to="/test" />, {
      wrapper: ({children}) => (
        <ShopifyProvider shopifyConfig={getShopifyConfig()}>
          {children}
        </ShopifyProvider>
      ),
    });

    const element = screen.getByRole('link', {
      name: new RegExp(money.amount),
    });

    expect(element).toHaveAttribute('href', '/test');
  });

  it(`removes trailing zeros when the prop is passed`, () => {
    const money = getPrice({
      currencyCode: 'EUR',
      amount: '19.00',
    });
    render(<Money data={money} withoutTrailingZeros />, {
      wrapper: ({children}) => (
        <ShopifyProvider shopifyConfig={getShopifyConfig()}>
          {children}
        </ShopifyProvider>
      ),
    });

    expect(screen.queryByText(`€${money.amount}`)).not.toBeInTheDocument();
    expect(screen.getByText(`€${19}`)).toBeInTheDocument();
  });

  it(`removes the currency symbol when the prop is passed`, () => {
    const money = getPrice({
      currencyCode: 'EUR',
    });
    render(<Money data={money} withoutCurrency />, {
      wrapper: ({children}) => (
        <ShopifyProvider shopifyConfig={getShopifyConfig()}>
          {children}
        </ShopifyProvider>
      ),
    });

    expect(screen.queryByText(`€${money.amount}`)).not.toBeInTheDocument();
    expect(screen.getByText(money.amount)).toBeInTheDocument();
  });

  it(`removes the currency symbol and trailing zeros when the props are both passed`, () => {
    const money = getPrice({
      currencyCode: 'EUR',
      amount: '19.00',
    });
    render(<Money data={money} withoutCurrency withoutTrailingZeros />, {
      wrapper: ({children}) => (
        <ShopifyProvider shopifyConfig={getShopifyConfig()}>
          {children}
        </ShopifyProvider>
      ),
    });

    expect(screen.queryByText(`€${money.amount}`)).not.toBeInTheDocument();
    expect(screen.queryByText(money.amount)).not.toBeInTheDocument();
    expect(screen.getByText('19')).toBeInTheDocument();
  });

  it(`allows a 'measurement' prop`, () => {
    const money = getPrice({
      currencyCode: 'EUR',
      amount: '19.00',
    });

    const measurement = getUnitPriceMeasurement();
    render(<Money data={money} measurement={measurement} />, {
      wrapper: ({children}) => (
        <ShopifyProvider shopifyConfig={getShopifyConfig()}>
          {children}
        </ShopifyProvider>
      ),
    });

    expect(
      screen.getByText(`/${measurement.referenceUnit}`, {exact: false})
    ).toBeInTheDocument();
  });

  it(`allows a 'measurement' prop with 'measurementSeparator' as a component`, () => {
    const money = getPrice({
      currencyCode: 'EUR',
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
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      }
    );

    expect(container.querySelector('br')).toBeInTheDocument();
    expect(
      screen.getByText(measurement.referenceUnit, {exact: false})
    ).toBeInTheDocument();
  });

  it(`allows a 'measurement' prop with 'measurementSeparator' as a string`, () => {
    const money = getPrice({
      currencyCode: 'EUR',
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
        wrapper: ({children}) => (
          <ShopifyProvider shopifyConfig={getShopifyConfig()}>
            {children}
          </ShopifyProvider>
        ),
      }
    );

    expect(
      screen.getByText(`${MeasurementSeparator}${measurement.referenceUnit}`, {
        exact: false,
      })
    ).toBeInTheDocument();
  });
});

export function getPrice(price: Partial<MoneyV2> = {}) {
  return {
    currencyCode: price.currencyCode ?? 'CAD',
    amount: price.amount ?? faker.finance.amount(),
  };
}

export function getUnitPriceMeasurement(
  unitPriceMeasurement: Partial<UnitPriceMeasurement> = {}
) {
  const measuredTypeToUnitMap: {
    WEIGHT: UnitPriceMeasurementMeasuredUnit[];
    VOLUME: UnitPriceMeasurementMeasuredUnit[];
    LENGTH: UnitPriceMeasurementMeasuredUnit[];
    AREA: UnitPriceMeasurementMeasuredUnit[];
  } = {
    WEIGHT: ['MG', 'G', 'KG'],
    VOLUME: ['ML', 'CL', 'L', 'M3'],
    LENGTH: ['MM', 'CM', 'M'],
    AREA: ['M2'],
  };
  const measuredType = faker.helpers.arrayElement<
    keyof typeof measuredTypeToUnitMap
  >(['WEIGHT', 'VOLUME', 'AREA', 'LENGTH']);
  const quantityUnit = faker.helpers.arrayElement(
    measuredTypeToUnitMap[measuredType]
  );
  const referenceUnit = faker.helpers.arrayElement(
    measuredTypeToUnitMap[measuredType]
  );

  return {
    measuredType: unitPriceMeasurement.measuredType ?? measuredType,
    quantityUnit: unitPriceMeasurement.quantityUnit ?? quantityUnit,
    quantityValue: unitPriceMeasurement.quantityValue ?? faker.datatype.float(),
    referenceUnit: unitPriceMeasurement.referenceUnit ?? referenceUnit,
    referenceValue:
      unitPriceMeasurement.referenceValue ?? faker.datatype.number(),
  };
}
