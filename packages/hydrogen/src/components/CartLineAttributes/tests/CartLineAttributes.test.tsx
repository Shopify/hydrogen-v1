import React from 'react';
import {mount} from '@shopify/react-testing';
import {CartLineProvider} from '../../CartLineProvider';
import {CartLineAttributes} from '../CartLineAttributes.client';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';

it('displays the attributes', () => {
  const wrapper = mount(
    <CartLineProvider line={CART_LINE}>
      <CartLineAttributes>
        {({key, value}) => (
          <>
            <h2>{key}</h2>
            <p>{value}</p>
          </>
        )}
      </CartLineAttributes>
    </CartLineProvider>
  );

  expect(wrapper.find('h2')!.text()).toBe('color');
  expect(wrapper.find('p')!.text()).toBe('red');
});
