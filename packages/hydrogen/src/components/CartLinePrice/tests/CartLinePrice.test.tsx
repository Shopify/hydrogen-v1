import React from 'react';
import {CartLineProvider} from '../../CartLineProvider';
import {CartLinePrice} from '../CartLinePrice.client';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';
import {Money} from '../../Money';
import {CurrencyCode} from '../../../storefront-api-types';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';

describe('<CartLinePrice />', () => {
  it('renders <Money /> with the regular price by default', () => {
    const line = {
      ...CART_LINE,
      cost: {
        ...CART_LINE.cost,
        totalAmount: {
          amount: '50',
          currencyCode: CurrencyCode.Usd,
        },
      },
    };

    const wrapper = mountWithProviders(
      <CartLineProvider line={line}>
        <CartLinePrice />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent(Money, {
      data: {amount: '50', currencyCode: CurrencyCode.Usd},
    });
  });

  it('renders <Money /> with the compareAt price when `priceType` is `compareAt`', () => {
    const line = {
      ...CART_LINE,
      cost: {
        ...CART_LINE.cost,
        compareAtAmountPerQuantity: {
          amount: '60',
          currencyCode: CurrencyCode.Usd,
        },
      },
    };

    const wrapper = mountWithProviders(
      <CartLineProvider line={line}>
        <CartLinePrice priceType="compareAt" />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent(Money, {
      data: {amount: '60', currencyCode: CurrencyCode.Usd},
    });
  });

  it('allows passthrough props', () => {
    const line = {
      ...CART_LINE,
      merchandise: {
        ...CART_LINE.merchandise,
        priceV2: {
          amount: '50',
          currencyCode: CurrencyCode.Usd,
        },
      },
    };

    const wrapper = mountWithProviders(
      <CartLineProvider line={line}>
        <CartLinePrice className="underline" />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent(Money, {
      className: 'underline',
    });
  });
});
