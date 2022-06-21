import React from 'react';
import {mount} from '@shopify/react-testing';
import {CartLineProvider} from '../../CartLineProvider';
import {CartLineProductTitle} from '../CartLineProductTitle.client';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';
import {Link} from '../../Link/Link.client';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';

describe(`<CartLineProductTitle/>`, () => {
  it('displays the title', () => {
    const wrapper = mount(
      <CartLineProvider line={CART_LINE}>
        <CartLineProductTitle />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent('span', {
      children: CART_LINE.merchandise.product.title,
    });
  });

  it('allows tag to be customized', () => {
    const wrapper = mount(
      <CartLineProvider line={CART_LINE}>
        <CartLineProductTitle as="h2" />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent('h2', {
      children: CART_LINE.merchandise.product.title,
    });
  });

  it(`validates props on components passed to the 'as' prop`, () => {
    const wrapper = mountWithProviders(
      <CartLineProvider line={CART_LINE}>
        <CartLineProductTitle as={Link} to="/test" />
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent(Link, {
      to: '/test',
    });
  });
});
