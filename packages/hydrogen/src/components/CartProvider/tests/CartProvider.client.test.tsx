import * as React from 'react';
import {CartContext} from '../context';
import {mountWithCartProvider} from './utilities';
import {CART_WITH_LINES} from './fixtures';
import type {CartLineInput} from '../../../graphql/types/types';
const useCartFetch = jest.fn();
jest.mock('../hooks', () => {
  return {
    useCartFetch: useCartFetch,
  };
});

describe(`CartProvider.client`, () => {
  describe(`totalQuantity`, () => {
    let TotalQuantity = () => (
      <CartContext.Consumer>
        {(cartContext) => {
          return <div>{cartContext?.totalQuantity}</div>;
        }}
      </CartContext.Consumer>
    );

    beforeEach(() => {
      useCartFetch.mockReset();
    });

    it(`should start with 1`, () => {
      const mount = mountWithCartProvider(<TotalQuantity />);
      expect(mount).toContainReactText(`1`);
    });

    xit(`should add 1 line when a new line is added with quantity of 1, for a total of 2`, () => {
      const newLine: CartLineInput = {
        merchandiseId: '123',
      };
      useCartFetch.mockReturnValue({
        data: {
          cartLinesAdd: {
            cart: {
              ...CART_WITH_LINES,
              lines: {edges: [...CART_WITH_LINES.lines.edges, newLine]},
            },
          },
        },
      });

      TotalQuantity = () => (
        <CartContext.Consumer>
          {(cartContext) => {
            return (
              <div>
                <span id="quantity">{cartContext?.totalQuantity}</span>
                <button
                  onClick={() => {
                    cartContext?.linesAdd([newLine]);
                  }}
                >
                  Add
                </button>
              </div>
            );
          }}
        </CartContext.Consumer>
      );

      const mount = mountWithCartProvider(<TotalQuantity />);
      mount.act(() => mount.find('button')?.trigger('onClick'));
      expect(mount.find('span')).toContainReactText(`2`);
    });
  });
});
