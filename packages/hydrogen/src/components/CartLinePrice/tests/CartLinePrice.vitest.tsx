import React from 'react';
import {render, screen} from '@testing-library/react';
import {CartLineProvider} from '../../CartLineProvider/index.js';
import {CartLinePrice} from '../CartLinePrice.client.js';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures.js';
import {CurrencyCode} from '../../../storefront-api-types.js';
import {ShopifyTestProviders} from '../../../utilities/tests/provider-helpers.js';

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

    render(
      <CartLineProvider line={line}>
        <CartLinePrice />
      </CartLineProvider>,
      {wrapper: ShopifyTestProviders}
    );

    expect(screen.getByText('50', {exact: false})).toBeInTheDocument();
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

    render(
      <CartLineProvider line={line}>
        <CartLinePrice priceType="compareAt" />
      </CartLineProvider>,
      {wrapper: ShopifyTestProviders}
    );

    expect(screen.getByText('60', {exact: false})).toBeInTheDocument();
  });

  it('allows passthrough props', () => {
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

    render(
      <CartLineProvider line={line}>
        <CartLinePrice className="underline" />
      </CartLineProvider>,
      {wrapper: ShopifyTestProviders}
    );

    const money = screen.getByText('50', {exact: false});

    expect(money).toBeInTheDocument();
    expect(money).toHaveClass('underline');
  });
});
