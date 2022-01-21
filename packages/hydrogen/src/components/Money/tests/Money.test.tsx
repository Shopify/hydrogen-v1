import React from 'react';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {CurrencyCode} from '../../../graphql/types/types';
import {getPrice} from '../../../utilities/tests/price';
import {Money} from '../Money.client';

describe('<Money />', () => {
  it('renders a formatted money string', () => {
    const money = getPrice({currencyCode: CurrencyCode.Usd});
    const component = mountWithProviders(<Money money={money} />);

    expect(component).toContainReactText(`$${money.amount}`);
  });

  it('handles different currency codes', () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Eur,
    });
    const component = mountWithProviders(<Money money={money} />);

    expect(component).toContainReactText(`€${money.amount}`);
  });

  it('allows pass-through props to the wrapping component', () => {
    const component = mountWithProviders(
      <Money money={getPrice()} className="money" />
    );

    expect(component).toHaveReactProps({className: 'money'});
  });

  it('allows customization through a render function', () => {
    const money = getPrice({
      currencyCode: CurrencyCode.Cad,
    });
    const component = mountWithProviders(
      <Money money={money}>
        {(money) => <p>{`You owe ${money.amount}!`}</p>}
      </Money>
    );

    expect(component).toContainReactComponent('p', {
      children: `You owe ${money.amount}!`,
    });
  });
});
