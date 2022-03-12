import React from 'react';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {CurrencyCode} from '../../../storefront-api-types';
import {getPrice} from '../../../utilities/tests/price';
import {Money} from '../Money.client';
import {Link} from '../../Link/index';

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
});
