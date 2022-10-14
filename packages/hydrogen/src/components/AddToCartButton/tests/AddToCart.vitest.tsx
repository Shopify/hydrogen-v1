import React from 'react';
import {vi} from 'vitest';
import {CartProvider} from '../../CartProvider/index.js';
import {render, screen, waitFor} from '@testing-library/react';
import {ProductOptionsProvider} from '../../ProductOptionsProvider/index.js';
import {AddToCartButton} from '../AddToCartButton.client.js';
import {getProduct, getVariant} from '../../../utilities/tests/product.js';
import {
  ShopifyTestProviders,
  CartTestProviders,
} from '../../../utilities/tests/provider-helpers.js';
import userEvent from '@testing-library/user-event';

describe('<AddToCartButton/>', () => {
  beforeEach(() => {
    // @ts-expect-error Custom fetch for testing
    global.fetch = vi.fn(async (_url, _init) => {
      return {
        json: async () =>
          JSON.stringify({
            data: {},
          }),
      };
    });
  });

  it('renders a button', () => {
    const product = getProduct();
    render(
      <CartProvider>
        <ProductOptionsProvider data={product}>
          <AddToCartButton variantId="123">Add to cart</AddToCartButton>
        </ProductOptionsProvider>
      </CartProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(screen.getByRole('button')).toHaveTextContent('Add to cart');
  });

  it('allows passthrough props', () => {
    const product = getProduct();
    render(
      <CartProvider>
        <ProductOptionsProvider data={product}>
          <AddToCartButton variantId="123" className="bg-blue-600">
            Add to cart
          </AddToCartButton>
        </ProductOptionsProvider>
      </CartProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });

  describe('when variantId is set explicity', () => {
    it('renders a disabled button if the variantId is null', () => {
      const product = getProduct();

      render(
        <ProductOptionsProvider data={product}>
          <AddToCartButton variantId={null}>Add to cart</AddToCartButton>
        </ProductOptionsProvider>,
        {wrapper: CartTestProviders}
      );

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('calls linesAdd with the variantId', async () => {
      const product = getProduct();
      const mockLinesAdd = vi.fn();
      const id = '123';

      const user = userEvent.setup();
      render(
        <CartTestProviders
          cartProviderValues={{linesAdd: mockLinesAdd, cart: {id: '456'}}}
        >
          <ProductOptionsProvider data={product}>
            <AddToCartButton variantId={id}>Add to cart</AddToCartButton>
          </ProductOptionsProvider>
          ,
        </CartTestProviders>
      );

      await user.click(screen.getByRole('button'));

      expect(mockLinesAdd).toHaveBeenCalledTimes(1);
      expect(mockLinesAdd).toHaveBeenCalledWith([
        expect.objectContaining({
          merchandiseId: id,
        }),
      ]);
    });
  });

  describe('when inside a ProductOptionsProvider', () => {
    describe('and an initialVariantId is present', () => {
      it('calls linesAdd with the initialVariantId', async () => {
        const mockLinesAdd = vi.fn();
        const product = getProduct();
        const selectedVariant = product?.variants?.nodes?.[0];

        const user = userEvent.setup();
        render(
          <CartTestProviders
            cartProviderValues={{linesAdd: mockLinesAdd, cart: {id: '456'}}}
          >
            <ProductOptionsProvider
              data={product}
              initialVariantId={selectedVariant?.id}
            >
              <AddToCartButton>Add to cart</AddToCartButton>
            </ProductOptionsProvider>
          </CartTestProviders>
        );

        await user.click(screen.getByRole('button'));

        expect(mockLinesAdd).toHaveBeenCalledTimes(1);
        expect(mockLinesAdd).toHaveBeenCalledWith([
          expect.objectContaining({
            merchandiseId: selectedVariant?.id,
          }),
        ]);
      });
    });

    describe('and the initialVariantId is omitted', () => {
      it('calls linesAdd with the first available variant', async () => {
        const mockLinesAdd = vi.fn();
        const product = getProduct({
          variants: {
            nodes: [
              getVariant({
                availableForSale: true,
                id: 'some variant id',
              }),
            ],
          },
        });

        const user = userEvent.setup();

        render(
          <CartTestProviders
            cartProviderValues={{linesAdd: mockLinesAdd, cart: {id: '456'}}}
          >
            <ProductOptionsProvider data={product}>
              <AddToCartButton>Add to cart</AddToCartButton>
            </ProductOptionsProvider>
          </CartTestProviders>
        );

        await user.click(screen.getByRole('button'));

        expect(mockLinesAdd).toHaveBeenCalledTimes(1);
        expect(mockLinesAdd).toHaveBeenCalledWith([
          expect.objectContaining({
            merchandiseId: 'some variant id',
          }),
        ]);
      });
    });

    describe('and the initialVariantId is explicity set to null', () => {
      it('disables the button', () => {
        const mockLinesAdd = vi.fn();
        const product = getProduct();

        render(
          <CartTestProviders cartProviderValues={{linesAdd: mockLinesAdd}}>
            <ProductOptionsProvider data={product} initialVariantId={null}>
              <AddToCartButton>Add to cart</AddToCartButton>
            </ProductOptionsProvider>
            ,
          </CartTestProviders>
        );

        expect(screen.getByRole('button')).toBeDisabled();
      });
    });

    describe('when the button is clicked', () => {
      it('disables the button', async () => {
        const product = getProduct();
        const user = userEvent.setup();

        render(
          <CartProvider>
            <ProductOptionsProvider data={product}>
              <AddToCartButton variantId="123">Add to cart</AddToCartButton>
            </ProductOptionsProvider>
          </CartProvider>,
          {wrapper: ShopifyTestProviders}
        );

        user.click(screen.getByRole('button'));

        await waitFor(() => {
          expect(screen.getByRole('button')).toBeDisabled();
        });
      });

      it('renders a message for screen readers when an accessible label is provided', async () => {
        const product = getProduct();
        const user = userEvent.setup();

        render(
          <CartProvider>
            <ProductOptionsProvider data={product}>
              <AddToCartButton
                accessibleAddingToCartLabel="Adding product to your cart"
                variantId="123"
              >
                Add to cart
              </AddToCartButton>
            </ProductOptionsProvider>
          </CartProvider>,
          {wrapper: ShopifyTestProviders}
        );

        user.click(screen.getByRole('button'));

        await waitFor(() => {
          expect(screen.getByRole('alert')).toHaveTextContent(
            'Adding product to your cart'
          );
        });
      });
    });
  });
});
