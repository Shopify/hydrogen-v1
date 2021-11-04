import React from 'react';
import {mount} from '@shopify/react-testing';
import {CartLineProvider} from '../../CartLineProvider';
import {CartLineQuantity} from '../CartLineQuantity.client';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';

it('displays the quantity', () => {
  const wrapper = mount(
    <CartLineProvider line={CART_LINE}>
      <CartLineQuantity />
    </CartLineProvider>
  );

  expect(wrapper).toContainReactComponent('span', {
    children: CART_LINE.quantity,
  });
});

it('allows a custom tag', () => {
  const wrapper = mount(
    <CartLineProvider line={CART_LINE}>
      <CartLineQuantity as="p" />
    </CartLineProvider>
  );

  expect(wrapper).toContainReactComponent('p', {
    children: CART_LINE.quantity,
  });
});
