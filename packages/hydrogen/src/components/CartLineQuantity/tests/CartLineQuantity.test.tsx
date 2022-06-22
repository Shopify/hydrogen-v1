import React from 'react';
import {mount} from '@shopify/react-testing';
import {CartLineProvider} from '../../CartLineProvider';
import {CartLineQuantity} from '../CartLineQuantity.client';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';
import {Link} from '../../Link/Link.client';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';

describe('<CartLineQuantity />', () => {
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

  it(`validates props for a component passed to the 'as' prop`, () => {
    const wrapper = mountWithProviders(
      <CartLineProvider line={CART_LINE}>
        <CartLineQuantity as={Link} to="/test" />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent(Link, {
      to: '/test',
    });
  });
});
