import React from 'react';

import {mountWithProviders} from '../../../utilities/tests/shopifyMount';

const mockCreateInstantCheckout = jest.fn();
const mockUseInstantCheckout = jest.fn();
const mockUseCartFetch = jest.fn();

import {BuyNowButton} from '../BuyNowButton.client';

jest.mock('../../CartProvider', () => ({
  ...(jest.requireActual('../../CartProvider') as {}),
  useInstantCheckout: mockUseInstantCheckout,
  useCartFetch: mockUseCartFetch,
}));

describe('BuyNowButton', () => {
  beforeEach(() => {
    mockUseInstantCheckout.mockReturnValue({
      createInstantCheckout: mockCreateInstantCheckout,
      checkoutUrl: undefined,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a button', () => {
    const component = mountWithProviders(
      <BuyNowButton variantId="1">Add to Cart</BuyNowButton>
    );
    expect(component).toContainReactComponent('button', {
      children: 'Add to Cart',
    });
  });

  it('can optionally disable the button', () => {
    const component = mountWithProviders(
      <BuyNowButton disabled={true} variantId="1">
        Add to Cart
      </BuyNowButton>
    );

    expect(component).toContainReactComponent('button', {
      disabled: true,
    });
  });

  it('allows pass-through props', () => {
    const component = mountWithProviders(
      <BuyNowButton className="fancy-button" variantId="1">
        Add to Cart
      </BuyNowButton>
    );

    expect(component).toContainReactComponent('button', {
      className: 'fancy-button',
    });
  });

  describe('when the button is clicked', () => {
    it('uses useCartCreateCallback with the correct arguments', () => {
      const component = mountWithProviders(
        <BuyNowButton
          attributes={[
            {key: 'color', value: 'blue'},
            {key: 'size', value: 'large'},
          ]}
          quantity={4}
          variantId="SKU123"
        >
          Add to Cart
        </BuyNowButton>
      );

      component.act(() => {
        component.find('button')?.trigger('onClick');
      });

      expect(mockCreateInstantCheckout).toHaveBeenCalledTimes(1);
      expect(mockCreateInstantCheckout).toHaveBeenCalledWith({
        lines: [
          {
            quantity: 4,
            merchandiseId: 'SKU123',
            attributes: [
              {key: 'color', value: 'blue'},
              {key: 'size', value: 'large'},
            ],
          },
        ],
      });
    });

    it('disables the button', () => {
      const component = mountWithProviders(
        <BuyNowButton variantId="1">Add to Cart</BuyNowButton>
      );

      expect(component).toContainReactComponent('button', {
        disabled: false,
      });

      component.act(() => {
        component.find('button')?.trigger('onClick');
      });

      expect(component.find('button')).toHaveReactProps({disabled: true});
    });
  });

  describe('when a checkout URL is available', () => {
    const {location} = window;
    const mockSetHref = jest.fn((href) => href);

    beforeEach(() => {
      mockUseInstantCheckout.mockReturnValue({
        createInstantCheckout: mockCreateInstantCheckout,
        checkoutUrl: '/checkout?id=123',
      });

      delete (window as Partial<Window>).location;
      window.location = {...window.location};
      Object.defineProperty(window.location, 'href', {
        set: mockSetHref,
      });
    });

    afterEach(() => (window.location = location));

    it('redirects to checkout', () => {
      mountWithProviders(
        <BuyNowButton variantId="1">Add to Cart</BuyNowButton>
      );

      expect(mockSetHref).toHaveBeenCalledTimes(1);
      expect(mockSetHref).toHaveBeenCalledWith('/checkout?id=123');
    });
  });
});
