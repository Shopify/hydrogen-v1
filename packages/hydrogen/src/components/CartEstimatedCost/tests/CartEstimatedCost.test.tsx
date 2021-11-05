import React from 'react';
import {CartProvider} from '../../CartProvider';
import {CART_WITH_LINES} from '../../CartProvider/tests/fixtures';
import {CartEstimatedCost} from '../CartEstimatedCost.client';
import {Money} from '../../Money';
import {mountWithShopifyProvider} from '../../../utilities/tests/shopify_provider';

describe('<CartEstimatedCost />', () => {
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

  it('renders a <Money />', () => {
    const wrapper = mountWithShopifyProvider(
      <CartProvider cart={CART_WITH_LINES}>
        <CartEstimatedCost />
      </CartProvider>
    );

    expect(wrapper).toContainReactComponent(Money);
  });

  it('does not render when no estimated cost', () => {
    const wrapper = mountWithShopifyProvider(
      <CartProvider>
        <CartEstimatedCost />
      </CartProvider>
    );

    expect(wrapper).not.toContainReactComponent(Money);
  });

  it('renders a totalAmount when total is the amountType', () => {
    const wrapper = mountWithShopifyProvider(
      <CartProvider cart={CART_WITH_LINES}>
        <CartEstimatedCost amountType="total" />
      </CartProvider>
    );

    const expectedMoney = CART_WITH_LINES.estimatedCost.totalAmount;
    expect(wrapper).toContainReactComponent(Money, {
      money: expectedMoney,
    });
  });

  it('renders a subtotalAmount when subtotal is the amountType', () => {
    const wrapper = mountWithShopifyProvider(
      <CartProvider cart={CART_WITH_LINES}>
        <CartEstimatedCost amountType="subtotal" />
      </CartProvider>
    );

    const expectedMoney = CART_WITH_LINES.estimatedCost.subtotalAmount;
    expect(wrapper).toContainReactComponent(Money, {
      money: expectedMoney,
    });
  });

  it('renders a totalTaxAmount when tax is the amountType', () => {
    const wrapper = mountWithShopifyProvider(
      <CartProvider cart={CART_WITH_LINES}>
        <CartEstimatedCost amountType="tax" />
      </CartProvider>
    );

    const expectedMoney = CART_WITH_LINES.estimatedCost.totalTaxAmount;
    expect(wrapper).toContainReactComponent(Money, {
      money: expectedMoney,
    });
  });

  it('renders a totalDutyAmount when duty is the amountType', () => {
    const wrapper = mountWithShopifyProvider(
      <CartProvider cart={CART_WITH_LINES}>
        <CartEstimatedCost amountType="duty" />
      </CartProvider>
    );

    const expectedMoney = CART_WITH_LINES.estimatedCost.totalDutyAmount;
    expect(wrapper).toContainReactComponent(Money, {
      money: expectedMoney,
    });
  });
});
