import React from 'react';
import {CartLineProvider} from '../../CartLineProvider/index.js';
import {CartLineQuantity} from '../../index.js';
import {CartLineQuantityAdjustButton} from '../CartLineQuantityAdjustButton.js';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures.js';
import {useCart} from '../../CartProvider/index.js';
import {CART_WITH_LINES_FLATTENED} from '../../CartProvider/tests/fixtures.js';
import {mountWithCartProvider} from '../../CartProvider/tests/utilities.js';
import {BaseButton} from '../../BaseButton/index.js';

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
        cart: {lines: [CART_LINE]},
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
        attributes: [
          {
            key: 'color',
            value: 'red',
          },
        ],
      },
    ]);
  });

  it('decreases quantity when quantity >= 2', () => {
    const linesUpdateMock = jest.fn();
    const customLine = {
      ...CART_WITH_LINES_FLATTENED['lines'][0],
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
        // @ts-ignore
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
        attributes: [
          {
            key: 'color',
            value: 'red',
          },
        ],
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
        cart: {
          lines: [CART_LINE],
        },
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
        lines: [CART_LINE],
      }
    );

    expect(wrapper).toContainReactComponent('span', {
      children: CART_LINE.quantity,
    });

    wrapper.find('button')!.trigger('onClick');

    expect(linesRemoveMock).toHaveBeenCalledWith([CART_LINE.id]);
  });

  describe('BaseButton', () => {
    it('passes the onClick handler', () => {
      const mockOnClick = jest.fn();
      const wrapper = mountWithCartProvider(
        <Cart>
          <CartLineQuantityAdjustButton onClick={mockOnClick} adjust="increase">
            Increase
          </CartLineQuantityAdjustButton>
        </Cart>,
        {
          cart: {lines: [CART_LINE]},
        }
      );

      expect(wrapper).toContainReactComponent(BaseButton, {
        onClick: mockOnClick,
      });
    });

    it('passes the buttonRef', () => {
      const mockRef = React.createRef<HTMLButtonElement>();

      const wrapper = mountWithCartProvider(
        <Cart>
          <CartLineQuantityAdjustButton buttonRef={mockRef} adjust="increase">
            Increase
          </CartLineQuantityAdjustButton>
        </Cart>,
        {
          cart: {lines: [CART_LINE]},
        }
      );

      expect(wrapper).toContainReactComponent(BaseButton, {
        buttonRef: mockRef,
      });
    });
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
