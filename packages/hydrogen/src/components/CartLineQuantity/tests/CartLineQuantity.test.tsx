import React from 'react';
import {mount} from '@shopify/react-testing';
import {CartLineProvider} from '../../CartLineProvider';
import {CartLineQuantity} from '../CartLineQuantity.client';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';

describe('<CartLineQuantity />', () => {
  it.skip('displays the quantity', () => {
    const wrapper = mount(
      <CartLineProvider line={CART_LINE}>
        <CartLineQuantity />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent('span', {
      children: CART_LINE.quantity,
    });
  });

  it.skip('allows a custom tag', () => {
    const wrapper = mount(
      <CartLineProvider line={CART_LINE}>
        <CartLineQuantity as="p" />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent('p', {
      children: CART_LINE.quantity,
    });
  });
});
