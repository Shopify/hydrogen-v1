import React from 'react';
import {CartProvider} from '../../CartProvider';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {mountWithCartProvider} from '../../CartProvider/tests/utilities';

import {ProductProvider} from '../../ProductProvider';
import {CART} from '../../CartProvider/tests/fixtures';
import {AddToCartButton} from '../AddToCartButton.client';
import {getProduct, getVariant} from '../../../utilities/tests/product';

describe('AddToCartButton', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(async (_url, _init) => {
      return {
        json: async () =>
          JSON.stringify({
            data: {},
          }),
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a button', () => {
    const component = mountWithProviders(
      <CartProvider>
        <AddToCartButton variantId="123">Add to cart</AddToCartButton>
      </CartProvider>
    );

    expect(component).toContainReactComponent('button', {
      children: 'Add to cart',
    });
  });

  it('allows passthrough props', () => {
    const component = mountWithProviders(
      <CartProvider>
        <AddToCartButton variantId="123" className="bg-blue-600">
          Add to cart
        </AddToCartButton>
      </CartProvider>
    );

    expect(component.find('button')).toHaveReactProps({
      className: 'bg-blue-600',
    });
  });

  describe('when variantId is set explicity', () => {
    it('renders a disabled button if the variantId is null', () => {
      const component = mountWithCartProvider(
        <AddToCartButton variantId={null}>Add to cart</AddToCartButton>
      );

      expect(component).toContainReactComponentTimes('button', 1, {
        disabled: true,
      });
    });

    describe('and a Cart Id is present', () => {
      it('calls linesAdd with the variantId', () => {
        const mockLinesAdd = jest.fn();
        const id = '123';
        const component = mountWithCartProvider(
          <AddToCartButton variantId={id}>Add to cart</AddToCartButton>,
          {linesAdd: mockLinesAdd}
        );
        component.find('button')?.trigger('onClick');

        expect(mockLinesAdd).toHaveBeenCalledTimes(1);
        expect(mockLinesAdd).toHaveBeenCalledWith([
          expect.objectContaining({
            merchandiseId: id,
          }),
        ]);
      });
    });

    describe('and a Cart Id is not present', () => {
      it('calls createCart with the variantId', () => {
        const mockCreateCart = jest.fn();
        const id = '123';
        const component = mountWithCartProvider(
          <AddToCartButton variantId={id}>Add to cart</AddToCartButton>,
          {cartCreate: mockCreateCart}
        );
        component.find('button')?.trigger('onClick');

        expect(mockCreateCart).toHaveBeenCalledTimes(1);
        expect(mockCreateCart).toHaveBeenCalledWith({
          lines: [
            expect.objectContaining({
              merchandiseId: id,
            }),
          ],
        });
      });
    });
  });

  describe('when inside a ProductProvider', () => {
    describe('and an initialVariantId is present', () => {
      describe('and a Cart ID is present', () => {
        it('calls linesAdd with the initialVariantId', () => {
          const mockLinesAdd = jest.fn();
          const product = getProduct();
          const selectedVariant = product.variants.edges[0].node;

          const component = mountWithCartProvider(
            <ProductProvider
              data={product}
              initialVariantId={selectedVariant.id}
            >
              <AddToCartButton>Add to cart</AddToCartButton>
            </ProductProvider>,
            {linesAdd: mockLinesAdd}
          );

          component.find('button')?.trigger('onClick');

          expect(mockLinesAdd).toHaveBeenCalledTimes(1);
          expect(mockLinesAdd).toHaveBeenCalledWith([
            expect.objectContaining({
              merchandiseId: selectedVariant.id,
            }),
          ]);
        });
      });

      describe('and a Cart Id is not present', () => {
        it('calls createCart with the initialVariantId', () => {
          const mockCreateCart = jest.fn();
          const product = getProduct();
          const selectedVariant = product.variants.edges[0].node;

          const component = mountWithCartProvider(
            <ProductProvider
              data={product}
              initialVariantId={selectedVariant.id}
            >
              <AddToCartButton>Add to cart</AddToCartButton>
            </ProductProvider>,
            {cartCreate: mockCreateCart}
          );

          component.find('button')?.trigger('onClick');

          expect(mockCreateCart).toHaveBeenCalledTimes(1);
          expect(mockCreateCart).toHaveBeenCalledWith({
            lines: [
              expect.objectContaining({
                merchandiseId: selectedVariant.id,
              }),
            ],
          });
        });
      });
    });

    describe('and the initialVariantId is omitted', () => {
      describe('and a Cart Id is present', () => {
        it('calls linesAdd with the first available variant', () => {
          const mockLinesAdd = jest.fn();
          const product = getProduct({
            variants: {
              edges: [
                {
                  node: getVariant({
                    availableForSale: true,
                    id: 'some variant id',
                  }) as any,
                },
              ],
            },
          });

          const component = mountWithCartProvider(
            <ProductProvider data={product}>
              <AddToCartButton>Add to cart</AddToCartButton>
            </ProductProvider>,
            {linesAdd: mockLinesAdd}
          );

          component.find('button')?.trigger('onClick');

          expect(mockLinesAdd).toHaveBeenCalledTimes(1);
          expect(mockLinesAdd).toHaveBeenCalledWith([
            expect.objectContaining({
              merchandiseId: 'some variant id',
            }),
          ]);
        });
      });

      describe('and a Cart ID is not present', () => {
        it('calls createCart with the first available variant', () => {
          const mockCreateCart = jest.fn();
          const product = getProduct({
            variants: {
              edges: [
                {
                  node: getVariant({
                    availableForSale: false,
                    id: 'some-unavailable-variant-id',
                  }) as any,
                },
                {
                  node: getVariant({
                    availableForSale: true,
                    id: 'an-available-variant-id',
                  }) as any,
                },
                {
                  node: getVariant({
                    availableForSale: false,
                    id: 'another-unavailable-variant-id',
                  }) as any,
                },
                {
                  node: getVariant({
                    availableForSale: true,
                    id: 'another-available-variant-id',
                  }) as any,
                },
              ],
            },
          });

          const component = mountWithCartProvider(
            <ProductProvider data={product}>
              <AddToCartButton>Add to cart</AddToCartButton>
            </ProductProvider>,
            {cartCreate: mockCreateCart}
          );

          component.find('button')?.trigger('onClick');

          expect(mockCreateCart).toHaveBeenCalledTimes(1);
          expect(mockCreateCart).toHaveBeenCalledWith({
            lines: [
              expect.objectContaining({
                merchandiseId: 'an-available-variant-id',
              }),
            ],
          });
        });

        it.only('calls createCart with the first variant when non are available', () => {
          const mockCreateCart = jest.fn();
          const product = getProduct({
            variants: {
              edges: [
                {
                  node: getVariant({
                    availableForSale: false,
                    id: 'some-unavailable-variant-id',
                  }) as any,
                },
                {
                  node: getVariant({
                    availableForSale: false,
                    id: 'another-unavailable-variant-id',
                  }) as any,
                },
              ],
            },
          });

          const component = mountWithCartProvider(
            <ProductProvider data={product}>
              <AddToCartButton>Add to cart</AddToCartButton>
            </ProductProvider>,
            {cartCreate: mockCreateCart, cart: null}
          );

          component.find('button')?.trigger('onClick');

          expect(mockCreateCart).toHaveBeenCalledTimes(1);
          expect(mockCreateCart).toHaveBeenCalledWith({
            lines: [
              expect.objectContaining({
                merchandiseId: 'some-unavailable-variant-id',
              }),
            ],
          });
        });
      });
    });

    describe('and the initialVariantId is explicity set to null', () => {
      it('disables the button', () => {
        const mockLinesAdd = jest.fn();
        const product = getProduct();

        const component = mountWithCartProvider(
          <ProductProvider data={product} initialVariantId={null}>
            <AddToCartButton>Add to cart</AddToCartButton>
          </ProductProvider>,
          {linesAdd: mockLinesAdd}
        );

        expect(component).toContainReactComponentTimes('button', 1, {
          disabled: true,
        });
      });
    });
  });

  describe('when the button is clicked', () => {
    it('disables the button', () => {
      const component = mountWithProviders(
        <CartProvider>
          <AddToCartButton variantId="123">Add to cart</AddToCartButton>
        </CartProvider>
      );

      component.find('button')?.trigger('onClick');

      expect(component).toContainReactComponentTimes('button', 1, {
        disabled: true,
      });
    });

    it('renders a message for screen readers when an accessible label is provided', () => {
      const component = mountWithProviders(
        <CartProvider>
          <AddToCartButton
            accessibleAddingToCartLabel="Adding product to your cart"
            variantId="123"
          >
            Add to cart
          </AddToCartButton>
        </CartProvider>
      );

      component.find('button')?.trigger('onClick');

      expect(component).toContainReactComponent('p', {
        children: 'Adding product to your cart',
      });
    });
  });
});
