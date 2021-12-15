import React from 'react';
import {CartLineProvider} from '../../CartLineProvider';
import {CartLineQuantity} from '../../CartLineQuantity';
import {CartLineQuantityAdjustButton} from '../CartLineQuantityAdjustButton';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';
import {useCart} from '../../CartProvider';
import {
  CART_WITH_FLAT_LINES,
  mountWithCartProvider,
} from '../../CartProvider/tests/fixtures';

describe('CartLineQuantityAdjustButton', () => {
  it('increases quantity', () => {
    const linesUpdateMock = jest.fn();
    const wrapper = mountWithCartProvider(
      <Cart>
        <CartLineQuantityAdjustButton adjust="increase">
          Increase
        </CartLineQuantityAdjustButton>
      </Cart>,
      {
        linesUpdate: linesUpdateMock,
      }
    );

    expect(wrapper).toContainReactComponent('span', {
      children: CART_LINE.quantity,
    });

    wrapper.find('button')!.trigger('onClick');

    expect(linesUpdateMock).toHaveBeenCalledWith([
      {
        id: CART_LINE.id,
        quantity: 2,
      },
    ]);
  });

  it('decreases quantity when quantity >= 2', () => {
    const linesUpdateMock = jest.fn();
    const customLine = {
      ...CART_WITH_FLAT_LINES['lines'][0],
      quantity: 2,
    };
    const wrapper = mountWithCartProvider(
      <Cart>
        <CartLineQuantityAdjustButton adjust="decrease">
          Decrease
        </CartLineQuantityAdjustButton>
      </Cart>,
      {
        linesUpdate: linesUpdateMock,
        lines: [customLine],
      }
    );

    expect(wrapper).toContainReactComponent('span', {
      children: customLine.quantity,
    });

    wrapper.find('button')!.trigger('onClick');

    expect(linesUpdateMock).toHaveBeenCalledWith([
      {
        id: CART_LINE.id,
        quantity: 1,
      },
    ]);
  });

  it('decreases quantity and removes the line when quantity === 1', () => {
    const linesRemoveMock = jest.fn();
    const wrapper = mountWithCartProvider(
      <Cart>
        <CartLineQuantityAdjustButton adjust="decrease">
          Decrease
        </CartLineQuantityAdjustButton>
      </Cart>,
      {
        linesRemove: linesRemoveMock,
      }
    );

    expect(wrapper).toContainReactComponent('span', {
      children: CART_LINE.quantity,
    });

    wrapper.find('button')!.trigger('onClick');

    expect(linesRemoveMock).toHaveBeenCalledWith([CART_LINE.id]);
  });

  it('removes the line', () => {
    const linesRemoveMock = jest.fn();
    const wrapper = mountWithCartProvider(
      <Cart>
        <CartLineQuantityAdjustButton adjust="remove">
          Remove
        </CartLineQuantityAdjustButton>
      </Cart>,
      {
        linesRemove: linesRemoveMock,
      }
    );

    expect(wrapper).toContainReactComponent('span', {
      children: CART_LINE.quantity,
    });

    wrapper.find('button')!.trigger('onClick');

    expect(linesRemoveMock).toHaveBeenCalledWith([CART_LINE.id]);
  });
});

function Cart({children}: {children: any}) {
  const {lines} = useCart();

  return (
    <ul>
      {lines.map((line) => (
        <li key={line.id}>
          <CartLineProvider line={line}>
            <CartLineQuantity />
            {children}
          </CartLineProvider>
        </li>
      ))}
    </ul>
  );
}
