import React from 'react';
import {render, screen} from '@testing-library/react';
import {mount} from '@shopify/react-testing';
import {CartLineProvider} from '../../CartLineProvider/index.js';
import {CartLineQuantity} from '../CartLineQuantity.client.js';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures.js';
import {Link} from '../../Link/Link.client.js';
import {ShopifyTestProviders} from '../../../utilities/tests/provider-helpers.js';

describe('<CartLineQuantity />', () => {
  it('displays the quantity', () => {
    render(
      <CartLineProvider line={CART_LINE}>
        <CartLineQuantity />
      </CartLineProvider>
    );

    expect(screen.getByText(CART_LINE.quantity)).toBeInTheDocument();
  });

  it('allows a custom tag', () => {
    render(
      <CartLineProvider line={CART_LINE}>
        <CartLineQuantity as="p" />
      </CartLineProvider>
    );

    const quantity = screen.getByText(CART_LINE.quantity);

    expect(quantity).toBeInTheDocument();
    expect(quantity.tagName).toBe('P');
  });

  it(`validates props for a component passed to the 'as' prop`, () => {
    render(
      <CartLineProvider line={CART_LINE}>
        <CartLineQuantity as={Link} to="/test" />
      </CartLineProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    const quantity = screen.getByRole('link', {name: `${CART_LINE.quantity}`});

    expect(quantity).toBeInTheDocument();
    expect(quantity).toHaveAttribute('href', '/test');
  });
});
