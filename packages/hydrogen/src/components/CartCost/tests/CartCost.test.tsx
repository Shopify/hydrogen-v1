import React from 'react';
import {CartProvider} from '../../CartProvider/index.js';
import {CART_WITH_LINES} from '../../CartProvider/tests/fixtures.js';
import {CartCost} from '../CartCost.client.js';
import {Money} from '../../Money/index.js';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';

describe('<CartCost />', () => {
  const fetch = global.fetch;

  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(async (_url, _init) => {
      return {
        json: async () =>
          JSON.stringify({
            data: {},
          }),
      };
    });
  });

  afterEach(() => {
    global.fetch = fetch;
  });

  it('renders a <Money />', () => {
    const wrapper = mountWithProviders(
      <CartProvider data={CART_WITH_LINES}>
        <CartCost />
      </CartProvider>
    );

    expect(wrapper).toContainReactComponent(Money);
  });

  it('does not render when no estimated cost', () => {
    const wrapper = mountWithProviders(
      <CartProvider>
        <CartCost />
      </CartProvider>
    );

    expect(wrapper).not.toContainReactComponent(Money);
  });

  it('renders a totalAmount when total is the amountType', () => {
    const wrapper = mountWithProviders(
      <CartProvider data={CART_WITH_LINES}>
        <CartCost amountType="total" />
      </CartProvider>
    );

    const expectedMoney = CART_WITH_LINES.cost.totalAmount;
    expect(wrapper).toContainReactComponent(Money, {
      data: expectedMoney,
    });
  });

  it('renders a subtotalAmount when subtotal is the amountType', () => {
    const wrapper = mountWithProviders(
      <CartProvider data={CART_WITH_LINES}>
        <CartCost amountType="subtotal" />
      </CartProvider>
    );

    const expectedMoney = CART_WITH_LINES.cost.subtotalAmount;
    expect(wrapper).toContainReactComponent(Money, {
      data: expectedMoney,
    });
  });

  it('renders a totalTaxAmount when tax is the amountType', () => {
    const wrapper = mountWithProviders(
      <CartProvider data={CART_WITH_LINES}>
        <CartCost amountType="tax" />
      </CartProvider>
    );

    const expectedMoney = CART_WITH_LINES.cost.totalTaxAmount;
    expect(wrapper).toContainReactComponent(Money, {
      data: expectedMoney,
    });
  });

  it('renders a totalDutyAmount when duty is the amountType', () => {
    const wrapper = mountWithProviders(
      <CartProvider data={CART_WITH_LINES}>
        <CartCost amountType="duty" />
      </CartProvider>
    );

    const expectedMoney = CART_WITH_LINES.cost.totalDutyAmount;
    expect(wrapper).toContainReactComponent(Money, {
      data: expectedMoney,
    });
  });
});
