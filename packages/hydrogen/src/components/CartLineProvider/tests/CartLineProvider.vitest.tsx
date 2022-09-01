import React from 'react';
import {render, screen} from '@testing-library/react';
import {CartLineProvider} from '../CartLineProvider.client.js';
import {CART_LINE} from './fixtures.js';
import {useCartLine} from '../../../hooks/useCartLine/index.js';

it('provides a hook to access cart line data', () => {
  function Data() {
    const line = useCartLine();

    return <div>{JSON.stringify(line)}</div>;
  }

  const {container} = render(
    <CartLineProvider line={CART_LINE}>
      <Data />
    </CartLineProvider>
  );

  expect(container.querySelector('div')).toHaveTextContent(
    JSON.stringify(CART_LINE)
  );
});
