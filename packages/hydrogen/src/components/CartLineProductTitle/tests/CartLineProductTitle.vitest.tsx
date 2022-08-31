import React from 'react';
import {render, screen} from '@testing-library/react';
import {CartLineProvider} from '../../CartLineProvider/index.js';
import {CartLineProductTitle} from '../CartLineProductTitle.client.js';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures.js';
import {Link} from '../../Link/Link.client.js';
import {ShopifyTestProviders} from '../../../utilities/tests/provider-helpers.js';

describe(`<CartLineProductTitle/>`, () => {
  it('displays the title', () => {
    render(
      <CartLineProvider line={CART_LINE}>
        <CartLineProductTitle />
      </CartLineProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(
      screen.getByText(CART_LINE.merchandise.product.title)
    ).toBeInTheDocument();
  });

  it('allows tag to be customized', () => {
    render(
      <CartLineProvider line={CART_LINE}>
        <CartLineProductTitle as="h2" />
      </CartLineProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    const title = screen.getByText(CART_LINE.merchandise.product.title);

    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H2');
  });

  it(`validates props on components passed to the 'as' prop`, () => {
    render(
      <CartLineProvider line={CART_LINE}>
        <CartLineProductTitle as={Link} to="/test" />
      </CartLineProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    const title = screen.getByRole('link', {
      name: CART_LINE.merchandise.product.title,
    });

    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute('href', '/test');
  });
});
