import React from 'react';
import {mount} from '@shopify/react-testing';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';
import {CartLineProvider} from '../../CartLineProvider';
import {CartLineSelectedOptions} from '../CartLineSelectedOptions.client';

describe('<CartLineSelectedOptions />', () => {
  it('uses render props if provided', () => {
    const wrapper = mount(
      <CartLineProvider line={CART_LINE}>
        <CartLineSelectedOptions>
          {({name, value}) => (
            <>
              <h2>{name}</h2>: <p>{value}</p>
            </>
          )}
        </CartLineSelectedOptions>
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent('h2', {
      children: CART_LINE.merchandise.selectedOptions[0].name,
    });
    expect(wrapper).toContainReactComponent('p', {
      children: CART_LINE.merchandise.selectedOptions[0].value,
    });
  });

  it('renders items in ul > li by default', () => {
    const wrapper = mount(
      <CartLineProvider line={CART_LINE}>
        <CartLineSelectedOptions>
          {({name, value}) => (
            <>
              {name}: {value}
            </>
          )}
        </CartLineSelectedOptions>
      </CartLineProvider>
    );

    expect(wrapper).toContainReactComponent('ul');
    expect(wrapper).toContainReactComponent('li');
  });
});
