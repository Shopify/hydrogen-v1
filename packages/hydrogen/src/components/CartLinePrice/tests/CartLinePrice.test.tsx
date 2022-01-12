import React from 'react';
import {mount} from '@shopify/react-testing';
import {CartLineProvider} from '../../CartLineProvider';
import {CartLinePrice} from '../CartLinePrice.client';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';
import {Money} from '../../Money';
import {CurrencyCode} from '../../../graphql/types/types';
import {getShopifyConfig} from '../../../utilities/tests/shopifyMount';
import {setShopifyConfig} from '../../../foundation/useShop/use-shop';

setShopifyConfig(getShopifyConfig());

describe('<CartLinePrice />', () => {
  it('renders <Money /> with the regular price by default', () => {
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

    const wrapper = mount(
      <CartLineProvider line={line}>
        <CartLinePrice />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent(Money, {
      money: {amount: 50, currencyCode: CurrencyCode.Usd},
    });
  });

  it('renders <Money /> with the compareAt price when `priceType` is `compareAt`', () => {
    const line = {
      ...CART_LINE,
      merchandise: {
        ...CART_LINE.merchandise,
        compareAtPriceV2: {
          amount: '60',
          currencyCode: CurrencyCode.Usd,
        },
      },
    };

    const wrapper = mount(
      <CartLineProvider line={line}>
        <CartLinePrice priceType="compareAt" />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent(Money, {
      money: {amount: 60, currencyCode: CurrencyCode.Usd},
    });
  });

  it('factors in quantity for the amount passed to <Money />', () => {
    const line = {
      ...CART_LINE,
      quantity: 2,
      merchandise: {
        ...CART_LINE.merchandise,
        priceV2: {
          amount: '50',
          currencyCode: CurrencyCode.Usd,
        },
      },
    };

    const wrapper = mount(
      <CartLineProvider line={line}>
        <CartLinePrice />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent(Money, {
      money: {amount: 100, currencyCode: CurrencyCode.Usd},
    });
  });

  it('renders its children', () => {
    const line = {
      ...CART_LINE,
      merchandise: {
        ...CART_LINE.merchandise,
        priceV2: {
          amount: '50.0',
          currencyCode: CurrencyCode.Usd,
        },
      },
    };

    const wrapper = mount(
      <CartLineProvider line={line}>
        <CartLinePrice>
          {({localizedString}) => {
            return <p>{`The amount is ${localizedString}`}</p>;
          }}
        </CartLinePrice>
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent('p', {
      children: `The amount is $50.00`,
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

    const wrapper = mount(
      <CartLineProvider line={line}>
        <CartLinePrice className="underline" />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent(Money, {
      className: 'underline',
    });
  });
});
